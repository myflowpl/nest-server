import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { RoleNames, User } from '../entities/user.entity';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  @Get()
  @ApiAuth(RoleNames.ADMIN)
  @UseInterceptors(PerformanceInterceptor)
  me(@Auth() user: User) {

    return user;
  }
}
