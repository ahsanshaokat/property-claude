// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description: 'Roles of user',
    example: "['agent','user']",
  })
  @IsOptional()
  @IsNotEmpty()
  roles?: string[];

  @IsOptional()
  @IsNotEmpty()
  isVerified: boolean;
}
