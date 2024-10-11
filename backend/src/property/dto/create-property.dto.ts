import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { CreateFloorPlanDto } from '../floor-plan/dto/create-floor-plan.dto';
import { RentCriteriaDto } from './rent-criteria.dto';
export class CreatePropertyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  purpose: string;

  @IsNotEmpty()
  descriptions: string;

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  price: number;

  @IsNotEmpty()
  noOfBedRoom: number;

  @IsNotEmpty()
  noOfBathRoom: number;

  @IsOptional()
  @IsNotEmpty()
  propertySize: number;

  @IsOptional()
  @IsNotEmpty()
  yearBuild: number;

  @IsOptional()
  @IsNotEmpty()
  totalFloors: number;

  @IsOptional()
  @IsNotEmpty()
  accommodations: string;

  @IsOptional()
  @IsNotEmpty()
  ceilingHeight: number;

  @IsOptional()
  @IsNotEmpty()
  distanceFromCenter: number;

  @IsOptional()
  @IsNotEmpty()
  parking: string;

  @IsOptional()
  @IsNotEmpty()
  areaSize: number;

  @IsOptional()
  @IsNotEmpty()
  garage: boolean;

  @IsOptional()
  @IsNotEmpty()
  garageSize: number;

  @IsOptional()
  @IsNotEmpty()
  additionalSpec: string;

  @IsOptional()
  @IsNotEmpty()
  utilityCost: number;

  @IsOptional()
  @IsNotEmpty()
  cableTvCost: number;

  @IsOptional()
  @IsNotEmpty()
  electricityCost: string;

  @IsOptional()
  @IsNotEmpty()
  lat: number;

  @IsOptional()
  @IsNotEmpty()
  long: number;

  @IsNotEmpty()
  videoTourLink: string;

  @IsNotEmpty()
  @IsNumber()
  propertyType: number;

  @IsNotEmpty()
  agent: number;

  @IsNotEmpty()
  city: number;

  @IsOptional()
  @IsNotEmpty()
  @IsNumber()
  features: number[];

  @Type(() => CreateFloorPlanDto)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsNotEmpty()
  floorPlans: CreateFloorPlanDto[];

  @IsNotEmpty()
  propertyImages: number[];

  @Type(() => RentCriteriaDto)
  @ValidateNested({ each: true })
  @IsOptional()
  @IsNotEmpty()
  rentCriteria: RentCriteriaDto;
}
