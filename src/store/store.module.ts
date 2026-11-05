import { Module } from '@nestjs/common';
import { StoreService } from './store.service.js';
import { TEST_INJEDTION } from '../types.js';

@Module({
  imports: [],
  providers: [
    StoreService,

    {
      provide: TEST_INJEDTION,
      useValue: 'TEST FROM STORE'
    }
  ],
  exports: [StoreService, TEST_INJEDTION]
})
export class StoreModule { }
