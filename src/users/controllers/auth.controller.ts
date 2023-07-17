import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleNames, User } from '../entities/user.entity';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    @Get()
    @UseGuards(JwtAuthGuard)
    @Roles(RoleNames.ROOT)
    @ApiBearerAuth()
    me(@Auth() user: User, @Auth('token') token: string ) {
        
        return { user, token };
    }
}
