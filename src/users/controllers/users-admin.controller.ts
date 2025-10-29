import { Controller, Delete, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role, RoleNames, User } from '../entities/user.entity';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { StoreService } from '../../store/store.service';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

    constructor(
        private store: StoreService,
    ) {}

    @Post('roles/:userId/:roleName')
    @ApiParam({name: 'userId', type: Number})
    @ApiParam({name: 'roleName', type: String, enum: RoleNames})
    async addRole(
        @Param('userId', UserByIdPipe) user: User,
        @Param('roleName', RoleByNamePipe) role: Role,
    ) {

        const roles = user.roles || [];

        if(!roles.find(r => r.name === role.name)) {
            user.roles = [...roles, role];
            await this.store.save(user);
        }

        return { user, role }
    }

    @Delete('roles/:userId/:roleName')
    @ApiParam({name: 'userId', type: Number})
    @ApiParam({name: 'roleName', type: String, enum: RoleNames})
    async removeRole(
        @Param('userId', UserByIdPipe) user: User,
        @Param('roleName', RoleByNamePipe) role: Role,
    ) {

        const roles = user.roles || [];

        user.roles = roles.filter(r => r.name !== role.name);

        await this.store.save(user);

        return { user, role }
    }
}
