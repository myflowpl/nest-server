import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AvatarService } from './avatar.service.js';
import { UsersAdminController } from './users-admin.controller.js';
import { UsersController } from './users.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [AuthModule], // JwtAuthGuard (@ApiAuth) potrzebuje AuthService
  controllers: [UsersAdminController, UsersController],
  providers: [UsersService, AvatarService],
  exports: [UsersService],
})
export class UsersModule {}
