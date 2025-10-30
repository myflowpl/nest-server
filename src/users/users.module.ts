import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '../config';
import { StoreModule } from '../store/store.module';
import { UsersAdminController } from './controllers/users-admin.controller';
import { DbModule } from '../db/db.module';

@Module({
  imports: [
    // SYNC
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET
    // }),

    // ASYNC
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
        return {
          secret: config.JWT_SECRET,
          signOptions: {
            expiresIn: config.JWT_EXPIRES_IN
          }
        }
      },
    }),
    StoreModule,
    ConfigModule,
    DbModule,
  ],
  controllers: [AuthController, UsersAdminController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService, JwtModule],
})
export class UsersModule {}
