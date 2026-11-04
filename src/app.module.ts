import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { StoreModule } from './store/store.module.js';
import { ConfigModule } from './config/config.module.js';
import { ContactsModule } from './contacts/contacts.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [
    StoreModule, 
    ConfigModule, 
    ContactsModule, 
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {

  constructor() {}
}
