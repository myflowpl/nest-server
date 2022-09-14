import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthRegisterDto } from '../dto/auth.dto';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity';
import { UserExceptionFilter } from '../filters/user-exception.filter';
import { UserBlockedException, UserBlockReason } from '../filters/user.exception';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
@UseFilters(UserExceptionFilter)
export class AuthController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('me')
  @ApiAuth(RoleNames.ADMIN)
  @UseInterceptors(PerformanceInterceptor)
  me(@Payload('user') user: User) {
    console.log('CONTROLLER LOGIC')

    // throw new UserBlockedException(UserBlockReason.PAYMENT);

    return user;

  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body(ValidationPipe) data: AuthRegisterDto): Promise<User> {

    const [existingUser] = await this.usersService.findBy({ email: data.email});

    if(existingUser) {
      throw new BadRequestException(`Adres ${data.email} jest już zajęty`)
    }

    const password = await this.authService.encodePassword(data.password);

    const user = await this.usersService.create({
      ...data,
      password
    })

    return user;
  }
}
