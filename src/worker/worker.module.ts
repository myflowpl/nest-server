import { Module } from '@nestjs/common';
import { DbModule } from '../db/db.module';
import { PhotosModule } from '../photos/photos.module';
import { WorkerController } from './worker.controller';

@Module({
  imports: [PhotosModule, DbModule],
  controllers: [WorkerController]
})
export class WorkerModule {}
