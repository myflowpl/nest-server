import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiAuth } from '../decorators/api-auth.decorator';
import { AddRoleDto } from '../dto/users-admin.dto';
import { Role, RoleNames, User } from '../entities/user.entity';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>

  ) {}

  @Post('roles')
  @ApiBody({type: AddRoleDto})
  async addRole(
    @Body('userId', UserByIdPipe) user: User,
    @Body('roleName', RoleByNamePipe) role: Role,
  ) {

    if(!user.roles.find(r => r.name === role.name)) {

      user.roles.push(role);
  
      await this.userRepository.save(user);
    }


    return { user, role }
  }

  @Delete('roles')
  @ApiBody({type: AddRoleDto})
  @ApiAuth(RoleNames.ROOT)
  async removeRole(
    @Body('userId', UserByIdPipe) user: User,
    @Body('roleName', RoleByNamePipe) role: Role,
  ) {

    user.roles = user.roles.filter(r => r.name !== role.name);

    await this.userRepository.save(user);

    return { user, role }
  }
}
