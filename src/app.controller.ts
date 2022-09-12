import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private config: ConfigService,
  ) {
    // console.log('Config', config);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
