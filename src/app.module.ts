import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ConfigModule } from './config';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { PhotosModule } from './photos/photos.module';

@Module({
  imports: [
    StoreModule, 
    ConfigModule, 
    ContactsModule, 
    UsersModule, 
    DbModule, 
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
