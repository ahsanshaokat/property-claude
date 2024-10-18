import { IsNotEmpty } from 'class-validator';

export class CreatePropertyTypeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  alias: string;

  @IsNotEmpty()
  parent_category: string;
}
