import { Body, Controller, Get, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Auth } from '../decorators/auth.decorator';
import { ExceptionResponse, RequestPayload, RoleNames, User } from '../entities/user.entity';
import { Roles } from '../decorators/roles.decorator';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { AuthRegisterDto } from '../dto/auth.dto';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

    /**
     * profile info
     */
    @Get()
    @ApiAuth(RoleNames.ADMIN, RoleNames.ROOT)
    me(
        @Auth() user: User, 
        @Auth('token') token: string
    ): RequestPayload {

        return { user, token } ;
    }

    /**
     * registration
     */
    @Post('register')
    @UsePipes(new ValidationPipe({ transform: true }))
    register(@Body() data: AuthRegisterDto) {

        return data;
    }
}
