import { UserResponseDto } from '../../user/dto/user.response.dto';
import { ApiProperty, OmitType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export class UserDto extends OmitType(UserResponseDto, ['agent']) {}

@Exclude()
export class LoginResponseDto {
  @Expose()
  @ApiProperty()
  access_token: string;

  @Expose()
  @ApiProperty()
  refresh_token: string;

  @Expose()
  @ApiProperty({
    type: () => UserDto,
  })
  user: UserDto;

  @Expose()
  @ApiProperty()
  expires_at: number;
}
