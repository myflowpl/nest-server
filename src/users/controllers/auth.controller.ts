import { BadRequestException, Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto, AuthRegisterResponse } from '../dto/auth.dto';
import { RoleNames, User } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @UsePipes(ValidationPipe)
  async register(@Body() data: AuthRegisterDto): Promise<AuthRegisterResponse> {

    // sprawdzic czy dany email jest wolny
    let [user] = await this.usersService.findBy({email: data.email})

    if(user) {
      throw new BadRequestException(`Adres ${data.email} jest już zajęty`);
    }

    // zahashowac hasło
    const password = await this.authService.encodePassword(data.password);

    // utwrzyc rekord
    user = await this.usersService.create({
      ...data,
      password,
    });

    // zwrocic rekord
    return { user };
  }

  @Post('login')
  @UsePipes(ValidationPipe)
  async login(@Body() data: AuthLoginDto): Promise<AuthLoginResponse> {

    // sprawdzic czy email i haslo sa poprawne
    const user = await this.authService.validateUser(data.email, data.password)

    if(!user) {
      throw new BadRequestException(`Użytkownik ${data.email} nie istnieje`)
    }

    // stworzyc jwt token
    const token = await this.authService.encodeUserToken(user);

    // zwrocic response dto
    return { token, user }
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  // @Roles(RoleNames.ROOT)
  @ApiBearerAuth()
  me(@Auth() user: User) {

    return { user }
  }

  @Get('get/:id')
  @ApiParam({name: 'id', type: String})
  getById(@Param('id', UserByIdPipe) user: User) {

    return { user }
  }
}
