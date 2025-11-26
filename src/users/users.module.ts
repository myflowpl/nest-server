import { Inject, Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from './services/users.service';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService, HTTP_SERVER_URL } from '../config';
import { StoreModule } from '../store/store.module';
import { UsersAdminController } from './controllers/users-admin.controller';

@Module({
  imports: [
    StoreModule,
    ConfigModule,
    // sync 
    // JwtModule.register({
    //   secret: process.env.JWT_SECRET,
    //   signOptions: { expiresIn: '4d' },
    // }),

    // async
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.JWT_SECRET,
        signOptions: { expiresIn: '4d' },
      })
    }),
  ],
  controllers: [AuthController, UsersAdminController],
  providers: [UsersService, AuthService]
})
export class UsersModule {

  @Inject(HTTP_SERVER_URL)
  url: string;

  constructor(
    @Inject(HTTP_SERVER_URL)
    private serverUrl: string,
  ) {
    // console.log('server url in users module', serverUrl)
  }

  onModuleInit() {
    // console.log('URL inside uers module', this.url)
  }
}
