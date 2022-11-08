import { Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { AuthLoginDto, AuthRegisterDto } from '../dto/auth.dto';
import { RoleNames, User } from '../entities/user.entity';
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
  @ApiAuth(RoleNames.ADMIN)
  @UseInterceptors(PerformanceInterceptor, ClassSerializerInterceptor)
  me(@Auth() user: User) {

    return user;
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDto) {

    const [exists] = await this.usersService.findBy({email: data.email});

    if(exists) {
      throw new BadRequestException(`Email ${data.email} already taken`)
    }

    const password = await this.authService.encodePassword(data.password);

    const user = await this.usersService.create({
      ...data,
      password,
    });

    return user;

  }

  @Post('login')
  async login(@Body() data: AuthLoginDto) {

    const user = await this.authService.validateUser(data.email, data.password);

    if(!user) {
      throw new BadRequestException(`Credentials invalid`);
    }

    const token = await this.authService.encodeUserToken(user);

    return { token, user };
  }
}
 