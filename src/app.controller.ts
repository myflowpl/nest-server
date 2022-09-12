import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { StoreService } from './store/store.service';

@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
  ) {
    console.log('STORE', store);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
