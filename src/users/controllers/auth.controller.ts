import { BadRequestException, Body, Controller, Get, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleNames, User } from '../entities/user.entity';
import { Auth } from '../decorators/auth.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { AuthRegisterDto } from '../dto/auth.dto';
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
    @ApiAuth(RoleNames.ROOT)
    @ApiResponse({status: 200, type: User, description: 'Return user session data'})
    me(@Auth() user: User, @Auth('token') token: string ) {
        
        return { user, token };
    }

    @Post('register')
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
}
