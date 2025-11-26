import { BadRequestException, Body, Controller, Get, Post, UseGuards, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto } from '../dto/auth.dto';
import { UsersService } from '../services/users.service';
import { AuthService } from '../services/auth.service';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}
    
    @Get()
    @ApiAuth(RoleNames.ROOT)
    @UseInterceptors(PerformanceInterceptor)
    me( @Auth() user: User, @Auth('token') token: string ) {
        console.log('AuthController.me()', )
        return [user, token];
    }

    @Post('register')
    async register(@Body(ValidationPipe) data: AuthRegisterDto) {

        // validate input data with ValidationPipe & Decorators on DTO

        // check if user exists
        let user = await this.usersService.findOneBy({ email: data.email });
        if(user) {
            throw new BadRequestException(`Email "${data.email}" is already taken`)
        }

        // createh password hash
        const password = await this.authService.encodePassword(data.password);

        // create user entity
        user = new User({
            ...data,
            password,
        })

        // save entity
        await this.usersService.save(user);

        // return user
        return user;
    }

    @Post('login')
    async login(@Body(ValidationPipe) data: AuthLoginDto): Promise<AuthLoginResponse> {

        // validate input data with ValidationPipe & Decorators on DTO

        // find user by email
        let user = await this.usersService.findOneBy({ email: data.email });
        if(!user) {
            throw new BadRequestException(`Bad credentials`);
        }

        // validate password
        const isValid = await this.authService.validatePassword(data.password, user.password);

        if(!isValid) {
            throw new BadRequestException(`Bad credentials`);
        }

        // create token
        const token = await this.authService.encodeUserToken(user);

        // return user
        return { token, user };
    }
}
