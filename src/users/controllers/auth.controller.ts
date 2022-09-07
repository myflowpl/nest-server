import { BadRequestException, Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto, AuthRegisterResponse } from '../dto/auth.dto';
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
}
