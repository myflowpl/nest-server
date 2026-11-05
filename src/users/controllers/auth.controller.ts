import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity.js';
import { Auth } from '../decorators/auth.decorator.js';
import { ApiAuth } from '../decorators/api-auth.decorator.js';

@Controller('auth')
export class AuthController {

    @Get()
    @ApiAuth(RoleNames.ROOT)
    me(@Auth('user') user: User ) {

        console.log('user', user)

        return user;
    }
}
