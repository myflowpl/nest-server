import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    
    @Get()
    @ApiAuth(RoleNames.ROOT)
    me( @Auth() user: User, @Auth('token') token: string ) {

        return [user, token];
    }

}
