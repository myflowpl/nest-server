import { Body, Controller, Delete, Param, Post } from '@nestjs/common';
import { Role, RoleNames, User } from '../entities/user.entity';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { AddRoleDto } from '../dto/admin.dto';
import { StoreService } from '../../store/store.service';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

    constructor(
        private store: StoreService
    ) {}

    @Post('user/add-role')
    @ApiBody({type: AddRoleDto})
    // @ApiBody({name: 'userId', type: String })
    // @ApiParam({name: 'roleName', type: String, enum: RoleNames })
    async addRole(
        @Body('userId', UserByIdPipe) user: User,
        @Body('roleName', RoleByNamePipe) role: Role,
    ) {

        user.roles = [role];

        await this.store.save(user);

        return {user,role}
    }

    @Delete('user/remove-role')
    @ApiBody({type: AddRoleDto})
    // @ApiBody({name: 'userId', type: String })
    // @ApiParam({name: 'roleName', type: String, enum: RoleNames })
    async removeRole(
        @Body('userId', UserByIdPipe) user: User,
        @Body('roleName', RoleByNamePipe) role: Role,
    ) {

        const roles = user.roles || [];

        user.roles = roles.filter(r => role.name !== r.name);

        await this.store.save(user);

        return {user,role}
    }

}
