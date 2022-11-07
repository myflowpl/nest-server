import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';

@Controller('')
@ApiTags('App')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private storeService: StoreService,
    private config: ConfigService,
  ) {
    // console.log('CONFIG', config)
  }

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }
}
