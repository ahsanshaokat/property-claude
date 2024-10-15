/* eslint-disable prettier/prettier */
import { ApiProperty } from '@nestjs/swagger';
import { ProjectType } from '../enum/project-type.enum';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsNumber, IsDate } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ description: 'Name of the project' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the project' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Type of the project', enum: ProjectType })
  @IsNotEmpty()
  projectType: ProjectType;

  @ApiProperty({ description: 'Total area of the project', required: false })
  @IsOptional()
  @IsNumber()
  totalArea?: number;

  @ApiProperty({ description: 'Total number of units in the project', required: false })
  @IsOptional()
  @IsNumber()
  totalUnits?: number;

  @ApiProperty({ description: 'Company ID associated with the project' })
  @IsNotEmpty()
  @IsNumber()
  companyId: number;

  @ApiProperty({ description: 'Project start date', required: false })
  @IsOptional()
  @IsDate()
  startDate?: Date;

  @ApiProperty({ description: 'Estimated completion date', required: false })
  @IsOptional()
  @IsDate()
  completionDate?: Date;

  @ApiProperty({ description: 'Estimated budget for the project', required: false })
  @IsOptional()
  @IsNumber()
  budget?: number;

  @ApiProperty({ description: 'Estimated revenue for the project', required: false })
  @IsOptional()
  @IsNumber()
  estimatedRevenue?: number;

  @ApiProperty({ description: 'Is the project active?', required: false, default: true })
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({ 
    type: 'array', 
    items: { type: 'string', format: 'binary' }, 
    description: 'Array of images to be uploaded for the project', 
    required: false 
  })
  @IsOptional()
  @IsArray()
  images?: Express.Multer.File[];  // This property is optional and will hold multiple file uploads
}
