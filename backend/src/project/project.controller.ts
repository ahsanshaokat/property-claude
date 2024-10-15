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
    constructor(private readonly projectService: ProjectService) {}
  
    @Post()
    @UseInterceptors(FilesInterceptor('images')) // Ensure 'images' is used
    async create(
      @Body() createProjectDto: CreateProjectDto,
      @UploadedFiles() images: Express.Multer.File[], // Use 'images' consistently here
    ) {
      const project = await this.projectService.create(createProjectDto, images);
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
    @UseInterceptors(FilesInterceptor('projectImages')) // Again, ensure 'images' here
    async update(
      @Param('id') id: string,
      @Body() updateProjectDto: UpdateProjectDto,
      @UploadedFiles() projectImages: Express.Multer.File[], // Ensure consistent use of 'images'
    ) {
    console.log("images", updateProjectDto)
      return await this.projectService.update(+id, updateProjectDto, projectImages);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.projectService.remove(+id);
    }
  }
  