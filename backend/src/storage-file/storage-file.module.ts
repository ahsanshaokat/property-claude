import { Module } from '@nestjs/common';
import { StorageFileService } from './storage-file.service';
import { StorageFileController } from './storage-file.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageFile } from './entities/storage-file.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StorageFile])],
  controllers: [StorageFileController],
  providers: [StorageFileService],
  exports: [StorageFileService],
})
export class StorageFileModule {}
