import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Auth } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RoleNames, User } from '../entities/user.entity/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Roles(RoleNames.ROOT)
  me(@Auth() user: User) {

    // TODO do some logic for the authenticated user

    return user;
  }
}
