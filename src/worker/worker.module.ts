import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import { WorkerController } from './worker.controller';

@Module({
  // imports: [ConfigModule],
  controllers: [WorkerController]
})
export class WorkerModule {}
