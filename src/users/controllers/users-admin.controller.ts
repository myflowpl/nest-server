import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddRoleDto } from '../dto/auth.dto';
import { Role, User } from '../entities/user.entity';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

  @Client({transport: Transport.TCP, options: {port: 3001}})
  client: ClientProxy
  
  constructor(

    @InjectRepository(User)
    private userRepository: Repository<User>
  ) {}

  @Get('sum')
  sumNumbers() {

    const pattern = 'ADD_NUMBERS';
    const payload = [1,2,3];

    return this.client.send<number>(pattern, payload);
  }

  @Post('roles')
  @ApiBody({type: AddRoleDto})
  async addRole(
    @Body('userId', UserByIdPipe) user: User,
    @Body('roleName', RoleByNamePipe) role: Role,
  ) {

    user.roles.push(role);

    await this.userRepository.save(user);

    return {user, role}
  }
  
  @Delete('roles')
  @ApiBody({type: AddRoleDto})
  async deleteRole(
    @Body('userId', UserByIdPipe) user: User,
    @Body('roleName', RoleByNamePipe) role: Role,
  ) {

    user.roles = user.roles.filter(r => r.name !== role.name);

    await this.userRepository.save(user);

    return {user, role}
  }
}
