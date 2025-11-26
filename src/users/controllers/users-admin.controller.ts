import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Query, UseFilters } from '@nestjs/common';
import { Role, RoleNames, User } from '../entities/user.entity';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { UserByIdPipe } from '../pipes/user-by-id.pipe';
import { RoleByNamePipe } from '../pipes/role-by-name.pipe';
import { UsersService } from '../services/users.service';
import { AddRoleDto } from '../dto/users.dto';
import { UserBlockedException, UserExceptionFilter } from '../filters/user-exception.filter';

@Controller('users-admin')
@ApiTags('UsersAdmin')
@UseFilters(UserExceptionFilter)
export class UsersAdminController {

    constructor(
        private usersService: UsersService,
    ) {}

    @Get('error')
    error(@Query('type') type: string) {
        if(type == 'user') {
            throw new UserBlockedException('payment');
        }
        throw new InternalServerErrorException('test exception')
    }

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
