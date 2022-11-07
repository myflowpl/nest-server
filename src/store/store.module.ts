import { Module, Global } from '@nestjs/common';
import { StoreService } from './store.service';

// @Global()
@Module({
  controllers: [],
  providers: [StoreService],
  exports: [StoreService],
})
export class StoreModule {}
