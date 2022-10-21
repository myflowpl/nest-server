import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AddRoleDto } from '../dto/users-admin.dto';
import { Role, User } from '../entities/user.entity';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

  constructor(

  ) {}

  @Post('roles')
  @ApiBody({type: AddRoleDto})
  addRole(
    @Body('userId', UserByIdPipe) user: User,
    @Body('roleName', RoleByNamePipe) role: Role,
  ) {

    return { user, role }
  }
}
