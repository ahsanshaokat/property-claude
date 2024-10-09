import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFloorPlanDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  floorNo: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  noOfBathRoom: number;

  @IsNotEmpty()
  propertySize: number;

  @IsNotEmpty()
  noOfBedRoom: number;

  @IsOptional()
  @IsNotEmpty()
  floorPlanImages: number[];
}
