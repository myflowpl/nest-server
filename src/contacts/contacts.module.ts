import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { StoreModule } from '../store/store.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [StoreModule, UsersModule],
  controllers: [ContactsController],
  providers: [],
})
export class ContactsModule {}
