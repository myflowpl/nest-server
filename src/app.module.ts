import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ConfigModule, ConfigService } from './config';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { PhotosModule } from './photos/photos.module';
import { ApiModule, Configuration } from './api-client';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    StoreModule, 
    ConfigModule, 
    ContactsModule, 
    UsersModule, 
    DbModule, 
    PhotosModule,
    ApiModule.forRoot(() => {
      return new Configuration({
        basePath: 'http://localhost:3000',
      });
    }),
    ChatModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // {
    //   provide: AuthApi,
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {

    //     const options = new Configuration({
    //       basePath: 'http://localhost:3000',
    //       // accessToken: config.JWT_SECRET,
    //       accessToken() {
    //           return config.JWT_SECRET,
    //       }
    //     });

    //     return new AuthApi(options);
    //   }
    // }
  ],
})
export class AppModule {}
