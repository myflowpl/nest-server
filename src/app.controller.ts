import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from './store/store.service';

@Controller()
@ApiTags('App')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
  ) {
    console.log('Store Service', this.store);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
