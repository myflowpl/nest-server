import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { StoreModule } from '../store/store.module';
import { ConfigModule, ConfigService } from '../config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User } from './entities/user.entity';
import { UsersAdminController } from './controllers/users-admin.controller';

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
    }),
    TypeOrmModule.forFeature([User, Role])
  ],
  controllers: [AuthController, UsersAdminController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
