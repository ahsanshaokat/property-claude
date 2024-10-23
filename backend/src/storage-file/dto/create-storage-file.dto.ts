import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStorageFileDto {
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsNotEmpty()
  size: string;

  @IsOptional()
  fileName: string;

  @IsOptional()
  project_id: number;
}
