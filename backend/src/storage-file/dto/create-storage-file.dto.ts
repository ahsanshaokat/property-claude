import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStorageFileDto {
  @IsNotEmpty()
  type: string;

  @IsOptional()
  @IsNotEmpty()
  size: string;

  // Remove the validation requirement for fileName since it's auto-generated
  fileName?: string;
}
