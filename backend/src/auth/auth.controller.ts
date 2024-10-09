import { RequestUser } from '../common/type/req-user';
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login.response';
import { JwtRefreshAuthGuard } from './guard/jwt-refresh-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiResponse({
    description: 'Login response',
    type: LoginResponseDto,
  })
  @Post('/login')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return plainToInstance(
      LoginResponseDto,
      await this.authService.login(loginDto),
    );
  }
  @Post('/refresh')
  @UseGuards(JwtRefreshAuthGuard)
  refresh(@Req() req: Request) {
    const userToken = req.user as RequestUser;

    return this.authService.refreshTokens(userToken);
  }
}
