import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The first name of the User',
    example: 'John',
  })
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the User',
    example: 'Doe',
  })
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The username of the User',
    example: 'johndoe',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'The email of the User',
    example: 'john@gmail.com',
  })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The phone number of the User',
    example: '+8801712000000',
  })
  @IsNotEmpty()
  phone: string;

  @ApiProperty({
    description: 'The password of the User',
    example: 'Jhon@doe@123!@',
  })
  @IsNotEmpty()
  password: string;

  @IsOptional()
  @IsNotEmpty()
  role: string;
}
