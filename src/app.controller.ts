import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from './store/store.service';
import { ConfigService } from './config';

@ApiTags('App')
@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly storeService: StoreService,
    private readonly config: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('name')
  name(): string {
    // console.log('FROM STORE', this.storeService.findOneBy())
    return 'test';
  }
}
