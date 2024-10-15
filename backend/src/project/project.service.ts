import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Company } from 'src/company/entities/company.entity';
import { StorageFileService } from 'src/storage-file/storage-file.service';
import moment from 'moment';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly storageFileService: StorageFileService, // Inject StorageFileService
  ) {}

  // Create a project with multiple images
  async create(
    createProjectDto: CreateProjectDto,
    images: Express.Multer.File[],
  ) {
    const { startDate, completionDate } = createProjectDto;

    // Format dates to a valid PostgreSQL format (ISO 8601)
    const formattedStartDate = startDate ? moment(startDate).format() : null;
    const formattedCompletionDate = completionDate
      ? moment(completionDate).format()
      : null;

    const newProject = {
      ...createProjectDto,
      startDate: formattedStartDate,
      completionDate: formattedCompletionDate,
      images, // Handle image logic
    };

    // Now save the project with properly formatted dates and images
    return await this.projectRepository.save(newProject);
  }

  // Find all projects with their associated companies
  findAll() {
    return this.projectRepository.find({
      relations: ['company', 'projectImages'], // Assuming projectImages is a relation
    });
  }

  // Find a project by ID
  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['company', 'projectImages'], // Assuming projectImages is a relation
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  // Update a project and its images
  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    images: Express.Multer.File[],
  ) {
    const project = await this.projectRepository.preload({
      id,
      ...updateProjectDto,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    // Handle image updates if new images are provided
    if (images && images.length > 0) {
      await this.storageFileService.uploadProjectImages(images, project.id);
    }

    return await this.projectRepository.save(project);
  }

  // Remove a project by its ID
  async remove(id: number) {
    const project = await this.findOne(id);

    // Optionally, you could remove associated images if needed:
    // await this.storageFileService.removeImagesByProjectId(id);

    await this.projectRepository.remove(project);
  }
}
