import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Role, RoleNames, User } from '../entities/user.entity';
import { RoleByNamePipe } from '../pipes/role-by-name/role-by-name.pipe';
import { UserByIdPipe } from '../pipes/user-by-id/user-by-id.pipe';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

  constructor(
    private manager: EntityManager
  ) {}

  @Post('roles/:userId/:roleName')
  @ApiParam({name: 'userId', type: String})
  @ApiParam({name: 'roleName', type: String, enum: RoleNames})
  async addRole(
    @Param('userId', UserByIdPipe) user: User,
    @Param('roleName', RoleByNamePipe) role: Role,
  ) {
    // if user id is string number

    // convert user string id to number

    // find user

    // validate if user exits throw 404

    // validate if role name is valid

    // find role

    // validate if role not found 404

    // validate if user already has the role assigned
    if(!user.roles.find(r => r.name === role.name)) {
      // add role to user
      user.roles.push(role);
  
      // save 
      await this.manager.save(user)

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

    await this.manager.save(user);

    return {user , role}
  }
}
