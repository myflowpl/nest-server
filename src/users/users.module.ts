import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller.js';
import { UsersService } from './services/users.service.js';
import { AuthService } from './services/auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module.js';
import { ConfigService } from '../config/config.service.js';
import { StoreModule } from '../store/store.module.js';
import { UsersAdminController } from './controllers/users-admin.controller.js';

@Module({
  imports: [
    StoreModule,
    ConfigModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.JWT_SECRET,
          signOptions: { expiresIn: '1d' },
        }
      }
    }),
  ],
  controllers: [AuthController, UsersAdminController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
