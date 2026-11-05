import { Inject, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller.js';
import { UsersService } from './services/users.service.js';
import { AuthService } from './services/auth.service.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '../config/config.module.js';
import { ConfigService } from '../config/config.service.js';
import { StoreModule } from '../store/store.module.js';
import { UsersAdminController } from './controllers/users-admin.controller.js';
import { TEST_INJEDTION } from '../types.js';

@Module({
  imports: [
    ConfigModule,
    StoreModule,

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
export class UsersModule {

  constructor(
    @Inject(TEST_INJEDTION)
    test: string,
  ) {

    console.log('UERS MODULE INJECTED:', test)
  }


}
