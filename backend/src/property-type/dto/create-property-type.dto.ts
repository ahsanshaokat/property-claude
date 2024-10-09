import { IsNotEmpty } from 'class-validator';

export class CreatePropertyTypeDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  alias: string;
}
