import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '../config';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    StoreModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: {expiresIn: '4d'}
      })
    }),
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
  exports: [],
})
export class UsersModule {}
