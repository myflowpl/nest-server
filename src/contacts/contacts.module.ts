import { Module } from '@nestjs/common';
import { ContactsController } from './contacts.controller';
import { StoreModule } from '../store/store.module';
import { UsersModule } from '../users/users.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [StoreModule, CacheModule.register()],
  controllers: [ContactsController],
  providers: [ContactsController],
  exports: [ContactsController]
})
export class ContactsModule {}
