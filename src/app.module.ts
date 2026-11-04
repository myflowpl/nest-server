import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { StoreModule } from './store/store.module.js';
import { ConfigModule } from './config/config.module.js';

@Module({
  imports: [
    StoreModule, 
    ConfigModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  
  constructor() {}
}
