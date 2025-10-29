import { BadRequestException, Body, Controller, Get, Post, UnauthorizedException, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ExceptionResponse, RequestPayload, RoleNames, User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { AuthLoginDto, AuthRegisterDto } from '../dto/auth.dto';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../services/users.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    constructor(
        private authService: AuthService,
        private usersService: UsersService,
    ) {}

    /**
     * profile info
     */
    @Get()
    @ApiAuth(RoleNames.ADMIN, RoleNames.ROOT)
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

        await this.usersService.save(user);

        return user;
    }

    @Post('login')
    async login(@Body() data: AuthLoginDto) {

        // validate user
        const user = await this.authService.validateUser(data);

        // if not found throw exception
        if(!user) {
            throw new UnauthorizedException(`Credentials invalid`)
        }

        // create token
        const token = await this.authService.encodeUserToken(user);

        // return response
        return { token, user }
    }
}
