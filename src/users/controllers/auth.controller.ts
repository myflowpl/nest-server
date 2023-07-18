import { Controller, Get } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { RoleNames, User } from '../entities/user.entity';
import { Auth } from '../decorators/auth.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    @Get()
    @ApiAuth(RoleNames.ROOT)
    @ApiResponse({status: 200, type: User, description: 'Return user session data'})
    me(@Auth() user: User, @Auth('token') token: string ) {
        
        return { user, token };
    }
}
