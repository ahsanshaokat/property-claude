import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { Project } from './entities/project.entity';
import { Company } from '../company/entities/company.entity';
import { StorageFileModule } from '../storage-file/storage-file.module'; // Import StorageFileModule

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, Company]),
    forwardRef(() => StorageFileModule), // Use forwardRef to resolve circular dependencies
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
