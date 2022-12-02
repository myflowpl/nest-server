import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '../config';
import { JwtModule } from '@nestjs/jwt';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    ConfigModule,
    StoreModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({ 
        secret: config.JWT_SECRET
       })
    })
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService]
})
export class UsersModule {}
