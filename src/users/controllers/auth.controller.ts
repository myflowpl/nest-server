import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleNames, User } from '../entities/user.entity';
import { Auth } from '../decorators/auth.decorator';
import { MeResponse } from '../dto/auth.dto';
import { ApiAuth } from '../decorators/api-auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    @Get('me')
    @ApiAuth(RoleNames.ADMIN)
    me(
        @Auth() user: User,
        @Auth('token') token: string,
    ): MeResponse {

        // TODO use user & token

        return { user, token };
    }


}
