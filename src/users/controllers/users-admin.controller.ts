import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role, RoleNames, User } from '../entities/user.entity.js';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe.js';
import { UserByIdPipe } from '../pipes/user-by-id.pipe.js';
import { UsersService } from '../services/users.service.js';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

  constructor(
    private usersService: UsersService,
  ) {}

  @Post('roles/:userId/:roleName')
  @ApiParam({name: 'userId', type: String})
  @ApiParam({name: 'roleName', type: String, enum: RoleNames})
  async addRole(
    @Param('userId', UserByIdPipe) user: User,
    @Param('roleName', RoleByNamePipe) role: Role,
  ) {

    // validate if user already has the role assigned
    if(!user.roles.find(r => r.name === role.name)) {
      // add role to user
      user.roles.push(role);

      // save
      await this.usersService.save(user);
    }

    return {user, role}
  }

  @Delete('roles/:userId/:roleName')
  @ApiParam({name: 'userId', type: String})
  @ApiParam({name: 'roleName', type: String, enum: RoleNames})
  async removeRole(
    @Param('userId', UserByIdPipe) user: User,
    @Param('roleName', RoleByNamePipe) role: Role,
  ) {

    user.roles = user.roles.filter(r => r.name !== role.name);

    await this.usersService.save(user);

    return {user , role}
  }
}
