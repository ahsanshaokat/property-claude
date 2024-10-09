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

  @IsNotEmpty()
  propertySize: number;

  @IsNotEmpty()
  yearBuild: number;

  @IsNotEmpty()
  totalFloors: number;

  @IsNotEmpty()
  accommodations: string;

  @IsNotEmpty()
  ceilingHeight: number;

  @IsNotEmpty()
  distanceFromCenter: number;

  @IsNotEmpty()
  parking: string;

  @IsNotEmpty()
  areaSize: number;

  @IsNotEmpty()
  garage: boolean;

  @IsNotEmpty()
  garageSize: number;

  @IsOptional()
  @IsNotEmpty()
  additionalSpec: string;

  @IsNotEmpty()
  utilityCost: number;

  @IsNotEmpty()
  cableTvCost: number;

  @IsNotEmpty()
  electricityCost: string;

  @IsNotEmpty()
  lat: number;

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
