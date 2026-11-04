import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller.js';
import { UsersService } from './services/users.service.js';
import { AuthService } from './services/auth.service.js';

@Module({
  controllers: [AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
