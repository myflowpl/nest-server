import { Module } from '@nestjs/common';
import { StoreModule } from '../store/store.module';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [StoreModule],
  controllers: [ContactsController],
})
export class ContactsModule {}
