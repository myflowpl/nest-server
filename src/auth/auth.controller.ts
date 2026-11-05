import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from './decorators/api-auth.decorator.js';
import { Auth } from './decorators/auth.decorator.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { AuthUser } from './auth.types.js';
import { AuthService } from './auth.service.js';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Get('me')
  @ApiAuth()
  me(@Auth() user: AuthUser) {
    return user;
  }
}
