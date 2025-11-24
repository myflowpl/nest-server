import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { StoreModule } from '../store/store.module';

@Module({
  imports: [StoreModule],
  controllers: [ContactsController],
})
export class ContactsModule {}
