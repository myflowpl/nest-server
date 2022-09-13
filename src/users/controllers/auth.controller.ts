import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  @Get('me')
  @ApiAuth(RoleNames.ADMIN)
  @UseInterceptors(PerformanceInterceptor)
  me(@Payload('user') user: User) {
    console.log('CONTROLLER LOGIC')
    return user;

  }
}
