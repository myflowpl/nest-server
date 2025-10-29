import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { RoleNames, User } from '../entities/user.entity/user.entity';
import { Roles } from '../decorators/roles.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    @Get()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Roles(RoleNames.ADMIN, RoleNames.ROOT)
    me(
        @Auth() user: User, 
        @Auth('token') token: string
    ) {


        return { user, token } ;
    }
}
