import { Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, UseFilters} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity/user.entity';
import { UserExceptionFilter } from '../filters/user-exception.filter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  @Get()
  @ApiAuth(RoleNames.ADMIN)
  @UseInterceptors(PerformanceInterceptor, ClassSerializerInterceptor)
  @UseFilters(UserExceptionFilter)
  me(@Auth() user: User) {

    throw new Error('Test the exception filter');

    return user;
  }
}
