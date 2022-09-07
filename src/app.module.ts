import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { ContactsModule } from './contacts/contacts.module';
import { LoggerModule } from './logger/logger.module';
import { HttpModule } from '@nestjs/axios'
import { ConfigModule } from './config/config.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './db/db.module';
import { PhotosModule } from './photos/photos.module';

@Module({
  imports: [
    HttpModule,
    StorageModule, 
    ContactsModule, 
    LoggerModule, 
    ConfigModule, 
    UsersModule, 
    DbModule, 
    PhotosModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
