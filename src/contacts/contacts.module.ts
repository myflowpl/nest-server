import { Module } from '@nestjs/common';
import { LoggerModule } from '../logger/logger.module';
import { StorageModule } from '../storage/storage.module';
import { ContactsController } from './contacts.controller';

@Module({
  imports: [StorageModule, LoggerModule],
  controllers: [ContactsController],
  providers: [],
  exports: [],
})
export class ContactsModule {}
