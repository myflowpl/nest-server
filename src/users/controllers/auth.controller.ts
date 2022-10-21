import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, UseFilters, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthRegisterDto } from '../dto/auth.dto';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity';
import { UserExceptionFilter } from '../filters/user-exception.filter';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
// @UseFilters(UserExceptionFilter)
export class AuthController {

  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @Get()
  @ApiAuth(RoleNames.ADMIN)
  @UseInterceptors(PerformanceInterceptor)
  me(@Auth() user: User) {

    return user;
  }

  @Post('register')
  async register(@Body(new ValidationPipe({transform: true})) data: AuthRegisterDto): Promise<User> {

    const [existingUser] = await this.usersService.findBy({ email: data.email });

    if(existingUser) {
      throw new BadRequestException(`Email ${data.email} is already taken`);
    }

    const password = await this.authService.encodePassword(data.password);

    const user = await this.usersService.create({
      ...data,
      password
    })

    return user;
  }
}
