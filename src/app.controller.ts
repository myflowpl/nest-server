import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';

@Controller('home')
@ApiTags('HomePage')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private config: ConfigService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
