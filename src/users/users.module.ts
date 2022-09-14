import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { StoreModule } from '../store/store.module';
import { ConfigModule, ConfigService } from '../config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    StoreModule, 
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '4d'}
      })
    })
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
