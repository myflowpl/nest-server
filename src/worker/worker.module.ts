import { Module } from '@nestjs/common';
import { WorkerController } from './worker.controller';
import { ContactsModule } from '../contacts/contacts.module';

@Module({
  imports: [ContactsModule],
  controllers: [WorkerController]
})
export class WorkerModule {}
