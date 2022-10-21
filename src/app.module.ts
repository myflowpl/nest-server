import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ConfigModule } from './config/config.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { HttpModule } from '@nestjs/axios';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    HttpModule,
    StoreModule, 
    ConfigModule, 
    ContactsModule, 
    UsersModule, DbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
