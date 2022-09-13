import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  @Get('me')
  @ApiAuth(RoleNames.ROOT)
  me(@Payload('user') user: User) {

    return user;

  }
}
