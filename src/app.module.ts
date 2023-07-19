import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ConfigModule } from './config';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { PhotosModule } from './photos/photos.module';
import { ApiModule, Configuration } from './api-client';

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
    })
  ],
  controllers: [AppController],
  providers: [
    AppService, 
    // {
    //   provide: AuthApi,
    //   useFactory: () => {

    //     const options = new Configuration({
    //       basePath: 'http://localhost:3000',
    //     });

    //     return new AuthApi(options);
    //   }
    // }
  ],
})
export class AppModule {}
