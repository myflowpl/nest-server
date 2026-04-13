import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { Auth } from '../decorators/auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    @Get('me')
    @UseGuards(JwtAuthGuard)
    @ApiBearerAuth()
    me(
        @Auth() user: User,
        @Auth('token') token: string,
    ) {

        // TODO use user & token

        return { user, token };
    }


}
