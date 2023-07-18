import { Controller, Delete, Param, Post } from '@nestjs/common';
import { Role, RoleNames, User } from '../entities/user.entity';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { UsersService } from '../services/users.service';
import { ApiAuth } from '../decorators/api-auth.decorator';

@Controller('users-admin')
@ApiTags('UsersAdmin')
@ApiAuth(RoleNames.ADMIN)
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

        user.roles = [role];

        await this.usersService.save(user);

        return { user, role }
    }

    @Delete('roles/:userId/:roleName')
    @ApiParam({name: 'userId', type: String})
    @ApiParam({name: 'roleName', type: String, enum: RoleNames})
    async removeRole(
        @Param('userId', UserByIdPipe) user: User,
        @Param('roleName', RoleByNamePipe) role: Role,
    ) {

        const roles = user.roles || [];

        user.roles = roles.filter(r => r.name !== role.name);

        await this.usersService.save(user);

        return { user, role }
    }

}
