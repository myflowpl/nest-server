import { BadRequestException, Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto } from '../dto/auth.dto/auth.dto';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get()
  @ApiAuth(RoleNames.ROOT)
  me(@Auth() user: User) {

    // TODO do some logic for the authenticated user

    return user;
  }

  @Post('register')
  async register(@Body() data: AuthRegisterDto): Promise<User> {
    
    // find if email exists in database
    const existingUser = await this.usersService.findOneBy({ email: data.email })

    // throw error if it exists
    if(existingUser) {
      throw new BadRequestException(`Email ${data.email} is already taken`)
    }

    // encode password string to hash 
    const password = await this.authService.encodePassword(data.password);

    // create new user record in database
    const user = await this.usersService.create({
      ...data,
      password,
    });

    // return created user
    return user;
  }

  @Post('login')
  async login(@Body() data: AuthLoginDto): Promise<AuthLoginResponse> {

    // find user by email
    const user = await this.usersService.findOneBy({ email: data.email })

    // throw if user not found
    if(!user) {
      throw new BadRequestException(`Credentials invalid`)
    }

    // validate password
    const isValid = await this.authService.validatePassword(data.password, user.password);

    // throw if password invalid
    if(!isValid) {
      throw new BadRequestException(`Credentials invalid`)
    }

    // create token 
    const token = await this.authService.encodeUserToken(user);
    
    // & return response
    return { token, user };
  }
}

const admin = { name: 'Admin', parent: 'test' }
const root = { name: 'Root', password: 'value from B', status: 'active' }
const password = 'value of C'
const status = 'off'

const res = {
  ...admin,
  ...root,
  password,
  status: status,
}
// console.log(res)

const final = { 
  name: 'Root', 
  parent: 'test',
  password: 'value of C', 
  status: 'off' 
}