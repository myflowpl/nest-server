import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ExceptionResponse, RequestPayload, RoleNames, User } from '../entities/user.entity/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    @Get()
    @ApiAuth(RoleNames.ADMIN, RoleNames.ROOT)
    me(
        @Auth() user: User, 
        @Auth('token') token: string
    ): RequestPayload {


        return { user, token } ;
    }
}
