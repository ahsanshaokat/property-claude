/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateStorageFileDto } from './dto/create-storage-file.dto';
import { StorageFile } from './entities/storage-file.entity';
import { Project } from '../project/entities/project.entity';
import {
  cloudinaryDeleteFile,
  cloudinaryUpload,
} from '../common/util/cloudniary';
import { UpdateStorageFileDto } from './dto/update-storage-file.dto';

@Injectable()
export class StorageFileService {
  constructor(
    @InjectRepository(StorageFile)
    private readonly storageFileRepository: Repository<StorageFile>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  // Create a single file and associate it with a project
  async create(createDto: CreateStorageFileDto, file: Express.Multer.File) {
    try {
      const folderPath =
        process.env.NODE_ENV !== 'production'
          ? `${createDto.type}_local`
          : `property_finder_prod/${createDto.type}`;

      // Upload to Cloudinary
      const { secure_url, public_id } = await cloudinaryUpload(
        file.path,
        folderPath,
      );

      // Create the StorageFile entity and set fileName programmatically
      const storageFile = this.storageFileRepository.create({
        ...createDto,
        fileName: file.filename, // Automatically set this after Multer or Cloudinary handles it
        image_url: secure_url,
        public_id,
      });

      return await this.storageFileRepository.save(storageFile);
    } catch (error) {
      Logger.log(error);
      throw new BadRequestException(error.message);
    }
  }

  // Handle multiple file uploads and associate them with a project
  async uploadProjectImages(files: Express.Multer.File[], projectId: number) {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const uploadPromises = files.map(async (file) => {
      const { secure_url, public_id } = await cloudinaryUpload(
        file.path,
        'project_images',
      );

      const storageFile = this.storageFileRepository.create({
        fileName: file.filename,
        image_url: secure_url,
        public_id,
        type: 'project_image',
        project, // Associate with the project
      });

      return this.storageFileRepository.save(storageFile);
    });

    await Promise.all(uploadPromises);
  }

  // Find all storage files
  async findAll() {
    return await this.storageFileRepository.find({});
  }

  // Find one storage file by its ID
  async findOne(id: number) {
    return await this.storageFileRepository.findOneBy({ id });
  }

  // Find multiple files by their IDs
  async findByIds(ids: number[]) {
    try {
      return await this.storageFileRepository.find({
        where: { id: In([...ids]) },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // Update storage file details
  update(id: number, updateStorageFileDto: UpdateStorageFileDto) {
    return `This action updates a #${id} storageFile`;
  }

  // Remove storage file and delete from Cloudinary
  async remove(id: number) {
    try {
      const imageFile = await this.findOne(id);
      if (!imageFile) {
        throw new BadRequestException('Image file not found!');
      }
      await cloudinaryDeleteFile(imageFile.public_id);

      await this.storageFileRepository.delete(imageFile.id);

      return {
        success: true,
        message: 'Image file deleted successfully',
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
