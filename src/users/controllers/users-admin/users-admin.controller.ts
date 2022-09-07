import { Body, Controller, Delete, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserRoleDto } from '../../dto/auth.dto';
import { Role, User } from '../../entities/user.entity';
import { RoleByNamePipe } from '../../pipes/role-by-name.pipe';
import { UserByIdPipe } from '../../pipes/user-by-id.pipe';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Post('roles')
  @ApiBody({type: UserRoleDto})
  async addRole(
    @Body('userId', UserByIdPipe) user: User,
    @Body('roleName', RoleByNamePipe) role: Role,
  ) {

    user.roles.push(role);

    await this.userRepository.save(user);

    return {user,role}
  }

  @Delete('roles')
  @ApiBody({type: UserRoleDto})
  async removeRole(
    @Body('userId', UserByIdPipe) user: User,
    @Body('roleName', RoleByNamePipe) role: Role,
  ) {

    user.roles = user.roles.filter(r => r.name !== role.name)

    await this.userRepository.save(user);

    return {user,role}
  }
}
