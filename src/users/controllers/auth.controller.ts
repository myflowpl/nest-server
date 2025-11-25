import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { RoleNames, User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    
    @Get()
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    @Roles(RoleNames.ROOT)
    me( @Auth() user: User, @Auth('token') token: string ) {

        return [user, token];
    }

}
