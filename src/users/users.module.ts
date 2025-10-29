import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '../config';
import { StoreModule } from '../store/store.module';

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
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
