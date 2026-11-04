import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service.js';
import { StoreService } from './store/store.service.js';
import { ConfigService } from './config/config.service.js';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private config: ConfigService,
  ) {}

  @Get()
  getHello(): string {

    console.log('data', this.store.data)
    console.log('config', this.config)

    return this.appService.getHello();
  }
}
