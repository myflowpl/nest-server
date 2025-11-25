import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    me() {

        return 'working'
    }

}
