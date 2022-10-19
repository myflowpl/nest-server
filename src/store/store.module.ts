import { Module } from '@nestjs/common';
import { StoreService } from './store.service';

@Module({
  controllers: [],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
