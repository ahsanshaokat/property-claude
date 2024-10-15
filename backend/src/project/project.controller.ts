/* eslint-disable prettier/prettier */
// src/project/project.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UploadedFiles,
    UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
    constructor(
        private readonly projectService: ProjectService,
    ) { }

    @Post()
    @UseInterceptors(FilesInterceptor('images')) // Multer setup to handle multiple file uploads
    async create(
        @Body() createProjectDto: CreateProjectDto,
        @UploadedFiles() projectImages: Express.Multer.File[], // Multer will populate this with files
    ) {
        // Call the service's create method, passing in the DTO and the uploaded files
        const project = await this.projectService.create(createProjectDto, projectImages);
        return project;
    }

    @Get()
    findAll() {
        return this.projectService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(+id);
    }

    @Patch(':id')
    @UseInterceptors(FilesInterceptor('images')) // Interceptor to handle file uploads for updates
    async update(
        @Param('id') id: string,
        @Body() updateProjectDto: UpdateProjectDto,
        @UploadedFiles() images: Express.Multer.File[], // If updating images
    ) {
        return await this.projectService.update(+id, updateProjectDto, images);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectService.remove(+id);
    }
}
