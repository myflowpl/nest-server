import { Controller, Param, Post } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Role, RoleNames, User } from '../entities/user.entity';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';

@Controller('users-admin')
@ApiTags('UsersAdmin')
export class UsersAdminController {

    @Post('roles/:userId/:roleName')
    @ApiParam({name: 'userId', type: Number})
    @ApiParam({name: 'roleName', type: String, enum: RoleNames})
    async addRole(
        @Param('userId', UserByIdPipe) user: User,
        @Param('roleName', RoleByNamePipe) role: Role,
    ) {


        return { user, role }
    }
}
