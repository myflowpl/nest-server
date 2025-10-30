import { BadRequestException, Body, ClassSerializerInterceptor, Controller, Get, Post, UnauthorizedException, UnprocessableEntityException, UseFilters, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ExceptionResponse, RequestPayload, RoleNames, User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { AuthLoginDto, AuthRegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';
import { PerformanceInterceptor } from '../interceptors/performance.interceptor';
import { UserExceptionFilter } from '../filters/user-exception.filter';

@Controller('auth')
@ApiTags('Auth')
@UseInterceptors(PerformanceInterceptor, ClassSerializerInterceptor)
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    /**
     * profile info
     */
    @Get()
    @ApiAuth()
    me(
        @Auth() user: User, 
        @Auth('token') token: string
    ): RequestPayload {

        return { user, token } ;
    }

    /**
     * registration
     */
    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() data: AuthRegisterDto) {

        let user = await this.usersService.findOneBy({ email: data.email });

        if(user) {
            throw new BadRequestException(`Email ${data.email} is already taken`)
        }

        const password = await this.authService.encodePassword(data.password);

        user = new User({
            ...data,
            password,
        });

        const record = await this.usersService.createUser(user);

        return record;
    }

    @Post('login')
    @UsePipes(new ValidationPipe({ transform: true }))
    @UseFilters(UserExceptionFilter)
    async login(@Body() data: AuthLoginDto) {

        if(data.password === 'qwer') {
            throw new UnprocessableEntityException('strange exception');
        }

        // validate user
        const user = await this.usersService.findOneBy({ email: data.email });

        // if not found throw exception
        if(!user) {
            throw new UnauthorizedException(`Credentials invalid`)
        }
        
        // validate the password
        const isValid = await this.authService.validatePassword(data.password, user.password);
        if(!isValid) {
            throw new UnauthorizedException(`Credentials invalid`);
        }

        // create token
        const token = await this.authService.encodeUserToken(user);

        // return response
        return { token, user }
    }
}
