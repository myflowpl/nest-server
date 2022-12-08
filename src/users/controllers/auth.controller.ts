import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { ExceptionResponse, RoleNames, User } from '../entities/user.entity/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(RoleNames.ROOT)
  @ApiResponse({status: 401, type: ExceptionResponse, description: 'Unauthorized, JWT token required'})
  @ApiResponse({status: 403, type: ExceptionResponse, description: 'Unauthenticated, some roles required'})
  me(@Auth() user: User) {

    // TODO do some logic for the authenticated user

    return user;
  }
}
