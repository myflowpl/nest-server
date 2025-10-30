import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { StoreModule } from '../store/store.module';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [StoreModule, UsersModule, CacheModule.register()],
  controllers: [ContactsController],
  providers: [],
})
export class ContactsModule {}
