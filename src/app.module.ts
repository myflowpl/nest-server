import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StorageModule } from './storage/storage.module';
import { ContactsModule } from './contacts/contacts.module';
import { LoggerModule } from './logger/logger.module';

@Module({
  imports: [StorageModule, ContactsModule, LoggerModule],
  controllers: [AppController],
  providers: [AppService],
  exports: [],
})
export class AppModule {}
