import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStorageFileDto {
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsNotEmpty()
  size: string;

  fileName: string;
}
