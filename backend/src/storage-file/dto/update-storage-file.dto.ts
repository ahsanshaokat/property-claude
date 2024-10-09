import { PartialType } from '@nestjs/mapped-types';
import { CreateStorageFileDto } from './create-storage-file.dto';

export class UpdateStorageFileDto extends PartialType(CreateStorageFileDto) {}
