import { BadRequestException, Body, Controller, Get, Post, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleNames, User } from '../entities/user.entity';
import { Auth } from '../decorators/auth.decorator';
import { AuthLoginDto, AuthLoginResponse, AuthRegisterDto, MeResponse } from '../dto/auth.dto';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { StoreService } from '../../store/store.service';
import { AuthService } from '../services/auth.service';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(
        private store: StoreService,
        private authService: AuthService,
    ){}

    @Get('me')
    @ApiAuth(RoleNames.ADMIN)
    @UseInterceptors(PerformanceInterceptor)
    me(
        @Auth() user: User,
        @Auth('token') token: string,
    ): MeResponse {

        // TODO use user & token
        // throw new Error('test error')

        return { user, token };
    }

    @Post('register')
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true }
    }))
    async register(@Body() data: AuthRegisterDto): Promise<User> {

        let user = await this.store.findOneBy(User, { email: data.email });

        if(user) {
            throw new BadRequestException('user email is taken');
        }

        // chash password
        const password = await this.authService.encodePassword(data.password);

        // create entity
        user = new User({
            ...data,
            password,
        })

        // save entity
        await this.store.save(user);

        return user;

    }

    @Post('login')
    async login(@Body(ValidationPipe) data: AuthLoginDto): Promise<AuthLoginResponse> {


        let user = await this.store.findOneBy(User, { email: data.email });

        if(!user) {
            throw new BadRequestException('Bad credentials');
        }

        const isValid = await this.authService.validatePassword(data.password, user.password);

        if(!isValid) {
            throw new BadRequestException('Bad credentials');
        }

        const token = await this.authService.encodeUserToken(user);

        return { token, user }

    }

}
