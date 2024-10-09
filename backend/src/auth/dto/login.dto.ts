import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    default: 'shaikh',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    default: 'wert@123434',
  })
  @IsNotEmpty()
  password: string;
}
