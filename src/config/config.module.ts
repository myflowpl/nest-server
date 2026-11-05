import { Module } from '@nestjs/common';
import { ConfigService } from './config.service.js';
import { TEST_INJEDTION } from '../types.js';

@Module({
  providers: [
    ConfigService,
    {
      provide: TEST_INJEDTION,
      useValue: 'TEST FROM CONFIG'
    }
  ],
  exports: [ConfigService, TEST_INJEDTION],
})
export class ConfigModule {}
