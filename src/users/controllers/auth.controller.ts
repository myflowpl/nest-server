import { BadRequestException, Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity.js';
import { Auth } from '../decorators/auth.decorator.js';
import { ApiAuth } from '../decorators/api-auth.decorator.js';
import { AuthRegisterDto } from '../dto/auth.dto.js';
import { UsersService } from '../services/users.service.js';
import { AuthService } from '../services/auth.service.js';

@Controller('auth')
export class AuthController {

    constructor(
        private usersService: UsersService,
        private authService: AuthService,
    ) {}

    @Get()
    @ApiAuth(RoleNames.ROOT)
    me(@Auth('user') user: User) {

        console.log('user', user)

        return user;
    }


    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true }))
    async register(@Body() data: AuthRegisterDto): Promise<User> {

        let [user] = await this.usersService.findBy({ email: data.email });

        if (user) {
            throw new BadRequestException(`Adres ${data.email} jest już zajęty`);
        }

        const password = await this.authService.encodePassword(data.password);

        user = await this.usersService.create({
            ...data,
            password,
        });

        return user;
    }

}
