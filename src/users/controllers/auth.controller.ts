import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { ApiBearerAuth } from '@nestjs/swagger';
import { User } from '../entities/user.entity.js';

@Controller('auth')
export class AuthController {

    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    me( user: User ) {

        console.log('user', user)
        
        return user;
    }
}
