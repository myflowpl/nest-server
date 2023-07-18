import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleNames, User } from '../entities/user.entity';
import { Auth } from '../decorators/auth.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    @Get()
    @ApiAuth()
    @ApiResponse({status: 200, type: User, description: 'Return user session data'})
    me(@Auth() user: User, @Auth('token') token: string ) {
        
        return new AuthLoginResponse({ user, token });
    }

    @Post('register')
    async register(@Body(ValidationPipe) data: AuthRegisterDto) {

        let user = await this.usersService.findOneBy({ email: data.email });

        if(user) {
            throw new BadRequestException(`Email ${data.email} is already taken`)
        }

        const password = await this.authService.encodePassword(data.password);

        user = new User({
            ...data,
            password,
        });

        await this.usersService.save(user);

        return user;
    }

    @Post('login')
    async login(@Body() data: AuthLoginDto): Promise<AuthLoginResponse> {

        let user = await this.usersService.findOneBy({ email: data.email });

        if(!user) {
            throw new BadRequestException(`Bad credentials`)
        }

        const isValid = await this.authService.validatePassword(data.password, user.password);


        if(!isValid) {
            throw new BadRequestException(`Bad credentials`)
        }

        const token = await this.authService.encodeUserToken(user);

        return { token, user };
    }
}
