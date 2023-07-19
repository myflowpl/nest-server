import { Module } from '@nestjs/common';
import { StoreService } from './store.service';
import { EntityManager } from 'typeorm';

@Module({
  providers: [
    {
      provide: StoreService,
      useExisting: EntityManager,
    }
  ],
  exports: [StoreService],
})
export class StoreModule {}
