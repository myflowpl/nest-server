import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { ContactsV2Controller } from './contacts-v2.controller';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [
    StoreModule,
  ],
  controllers: [
    ContactsController,
    ContactsV2Controller,
  ]
})
export class ContactsModule {}
