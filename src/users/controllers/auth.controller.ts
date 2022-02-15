import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getMe(@Payload('user') user: User) {
    return { user };
  }
}
