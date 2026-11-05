import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { UsersAdminController } from './users-admin.controller.js';
import { UsersService } from './users.service.js';

@Module({
  imports: [AuthModule], // JwtAuthGuard (@ApiAuth) potrzebuje AuthService
  controllers: [UsersAdminController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
