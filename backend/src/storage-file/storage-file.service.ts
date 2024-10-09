import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateStorageFileDto } from './dto/create-storage-file.dto';
import { UpdateStorageFileDto } from './dto/update-storage-file.dto';
import { StorageFile } from './entities/storage-file.entity';
import {
  cloudinaryDeleteFile,
  cloudinaryUpload,
} from '../common/util/cloudniary';
@Injectable()
export class StorageFileService {
  constructor(
    @InjectRepository(StorageFile)
    private readonly storageFileRepository: Repository<StorageFile>,
  ) {}

  async create(createDto: CreateStorageFileDto, file: Express.Multer.File) {
    try {
      const folderPath =
        process.env.NODE_ENV != 'production'
          ? `${createDto.type}_local`
          : `property_finder_prod/${createDto.type}`;
      const { secure_url, public_id } = await cloudinaryUpload(
        file.path,
        folderPath,
      );

      const storageFile = this.storageFileRepository.create({
        ...createDto,
        fileName: file.filename,
        image_url: secure_url,
        public_id,
      });

      return await this.storageFileRepository.save(storageFile);
    } catch (error) {
      Logger.log(error);
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    return await this.storageFileRepository.find({});
  }

  async findOne(id: number) {
    return await this.storageFileRepository.findOneBy({ id: id });
  }

  async findByIds(ids: number[]) {
    try {
      return await this.storageFileRepository.find({
        where: { id: In([...ids]) },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  update(id: number, updateStorageFileDto: UpdateStorageFileDto) {
    return `This action updates a #${id} storageFile`;
  }

  async remove(id: number) {
    try {
      const imageFile = await this.findOne(id);
      if (!imageFile) {
        throw new BadRequestException('Image file not found !');
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
