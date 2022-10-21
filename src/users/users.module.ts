import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { ConfigModule, ConfigService } from '../config';
import { JwtModule } from '@nestjs/jwt';
import { StoreModule } from '../store/store.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role, User } from './entities/user.entity';

@Module({
  imports: [
    ConfigModule,
    StoreModule,
    TypeOrmModule.forFeature([User, Role]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      async useFactory(config: ConfigService) {
          return {
            secret: config.JWT_SECRET,
            signOptions: { expiresIn: '4d'}
          }
      },
    })
  ],
  controllers: [AuthController],
  providers: [UsersService, AuthService],
  exports: [UsersService, AuthService],
})
export class UsersModule {}
