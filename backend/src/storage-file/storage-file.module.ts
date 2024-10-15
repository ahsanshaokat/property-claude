import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFileService } from './storage-file.service';
import { StorageFileController } from './storage-file.controller';
import { StorageFile } from './entities/storage-file.entity';
import { Project } from '../project/entities/project.entity'; // Import Project entity
import { ProjectModule } from '../project/project.module'; // Import ProjectModule

@Module({
  imports: [
    TypeOrmModule.forFeature([StorageFile, Project]), // Include Project entity
    forwardRef(() => ProjectModule), // Use forwardRef to avoid circular dependencies
  ],
  controllers: [StorageFileController],
  providers: [StorageFileService],
  exports: [StorageFileService],
})
export class StorageFileModule {}
