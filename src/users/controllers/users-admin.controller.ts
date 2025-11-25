import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Role, RoleNames, User } from '../entities/user.entity';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { UsersService } from '../services/users.service';
import { AddRoleDto } from '../dto/users.dto';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

    constructor(
        private usersService: UsersService,
    ) {}

    @Post('roles')
    @ApiBody({type: AddRoleDto})
    async addRole(
        @Body('userId', UserByIdPipe) user: User,
        @Body('roleName', RoleByNamePipe) role: Role,
    ) {
        const roles = user.roles || [];

        if(!roles.find(r => r.name === role.name)) {

            user.roles = [...roles, role];
            await this.usersService.save(user);
        }


        return { user, role }
    }

    @Delete('roles/:userId/:roleName')
    @ApiParam({name: 'userId', type: String})
    @ApiParam({name: 'roleName', type: String, enum: RoleNames})
    async removeRole(
        @Param('userId', UserByIdPipe) user: User,
        @Param('roleName', RoleByNamePipe) role: Role,
    ) {

        user.roles = (user.roles || []).filter(r => r.name !== role.name);

        await this.usersService.save(user);

        return { user, role }
    }
}
