import { Body, Controller, Delete, Get, Header, Param, ParseEnumPipe, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthUser, RoleNames } from '../auth/auth.types.js';
import { ApiAuth } from '../auth/decorators/api-auth.decorator.js';
import { Auth } from '../auth/decorators/auth.decorator.js';
import { BulkBlockDto, ChangeStatusDto, ExportUsersQueryDto, ListUsersQueryDto } from './users.dto.js';
import { UsersService } from './users.service.js';

@Controller('admin/users')
@ApiTags('Admin: użytkownicy')
@ApiAuth(RoleNames.ADMIN)
export class UsersAdminController {
  constructor(private usersService: UsersService) {}

  @Get()
  list(@Query() query: ListUsersQueryDto) {
    return this.usersService.list(query);
  }

  @Get('export')
  @Header('Content-Type', 'text/csv; charset=utf-8')
  exportCsv(@Query() query: ExportUsersQueryDto) {
    return this.usersService.exportCsv(query);
  }

  @Post('bulk-block')
  bulkBlock(@Auth() actor: AuthUser, @Body() data: BulkBlockDto) {
    return this.usersService.bulkBlock(actor, data);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/status')
  changeStatus(@Auth() actor: AuthUser, @Param('id', ParseIntPipe) id: number, @Body() data: ChangeStatusDto) {
    return this.usersService.changeStatus(actor, id, data.status);
  }

  @Post(':id/roles/:role')
  @ApiParam({ name: 'role', enum: RoleNames })
  addRole(
    @Auth() actor: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Param('role', new ParseEnumPipe(RoleNames)) role: RoleNames,
  ) {
    return this.usersService.addRole(actor, id, role);
  }

  @Delete(':id/roles/:role')
  @ApiParam({ name: 'role', enum: RoleNames })
  removeRole(
    @Auth() actor: AuthUser,
    @Param('id', ParseIntPipe) id: number,
    @Param('role', new ParseEnumPipe(RoleNames)) role: RoleNames,
  ) {
    return this.usersService.removeRole(actor, id, role);
  }
}
