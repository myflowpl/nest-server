import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller.js';
import { StoreModule } from '../store/store.module.js';

@Module({
  imports: [StoreModule],
  controllers: [ContactsController],
})
export class ContactsModule {}
