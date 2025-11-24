import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from './store/store.service';
import { ConfigService } from './config';

@Controller()
@ApiTags('App')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private config: ConfigService,
  ) {
    // console.log('Store Service', this.config);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
