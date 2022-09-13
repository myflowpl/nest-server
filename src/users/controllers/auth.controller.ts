import { Controller, Get, UseFilters, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity';
import { UserExceptionFilter } from '../filters/user-exception.filter';
import { UserBlockedException, UserBlockReason } from '../filters/user.exception';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';

@Controller('auth')
@ApiTags('Auth')
@UseFilters(UserExceptionFilter)
export class AuthController {

  @Get('me')
  @ApiAuth(RoleNames.ADMIN)
  @UseInterceptors(PerformanceInterceptor)
  me(@Payload('user') user: User) {
    console.log('CONTROLLER LOGIC')

    // throw new UserBlockedException(UserBlockReason.PAYMENT);

    return user;

  }
}
