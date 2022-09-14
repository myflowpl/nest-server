import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, UnauthorizedException, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Payload } from '../decorators/payload.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto } from '../dto/auth.dto';
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
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('me')
  @ApiAuth()
  @UseInterceptors(PerformanceInterceptor)
  me(@Payload('user') user: User) {
    console.log('CONTROLLER LOGIC')

    // throw new UserBlockedException(UserBlockReason.PAYMENT);

    return user;

  }

  @Post('register')
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

  @Post('login')
  async login(@Body(ValidationPipe) data: AuthLoginDto): Promise<AuthLoginResponse> {

    const user = await this.authService.validateUser(data.email, data.password);

    if(!user) {
      throw new UnauthorizedException(`Credentials Invalid`)
    }

    const token = await this.authService.encodeUserToken(user);

    // return { token, user };
    return AuthLoginResponse.create({ token, user });
  }
}
