import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateAgentDto {
  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  designation: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  fb_link: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  instagram_link: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  twitter_link: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  linkedin_link: string;

  @ApiProperty()
  @IsOptional()
  @IsNotEmpty()
  agentImage: number;
}
