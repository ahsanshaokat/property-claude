import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFeatureDto {
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsNotEmpty()
  alias: string;
}
