import { Controller, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, UseFilters, Post, Body, BadRequestException, ValidationPipe} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto } from '../dto/auth.dto/auth.dto';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity/user.entity';
import { UserExceptionFilter } from '../filters/user-exception.filter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiAuth()
  @UseInterceptors(PerformanceInterceptor, ClassSerializerInterceptor)
  @UseFilters(UserExceptionFilter)
  me(@Auth() user: User) {

    // throw new Error('Test the exception filter');

    return user;
  }

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  async register(@Body(ValidationPipe) data: AuthRegisterDto): Promise<User> {

    // check if email exists
    let user = await this.usersService.findOneBy({ email: data.email })

    if(user) {
      throw new BadRequestException(`Emaill ${data.email} is already taken`);
    }

    // encode password to hash
    const password = await this.authService.encodePassword(data.password);

    // create user entity
    user = await this.usersService.create({
      ...data,
      password,
    });

    return user
  }

  @Post('login')
  async login(@Body(ValidationPipe) data: AuthLoginDto): Promise<AuthLoginResponse> {

    // find user by email
    let user = await this.usersService.findOneBy({ email: data.email })

    if(!user) {
      throw new BadRequestException(`Credentials invalid`);
    }

    // validate password
    const isValid = await this.authService.validatePassword(data.password, user.password);

    if(!isValid) {
      throw new BadRequestException(`Credentials invalid`);
    }

    // create jwt token
    const token = await this.authService.encodeUserToken(user);

    // return response
    return { token, user }
  }
}
