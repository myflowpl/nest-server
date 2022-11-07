import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { Auth } from '../decorators/auth.decorator';
import { RoleNames, User } from '../entities/user.entity';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  @Get()
  @ApiAuth(RoleNames.ADMIN)
  me(@Auth() user: User) {

    return user;
  }
}
