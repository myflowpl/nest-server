import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { StoreService } from './store/store.service';

@Controller('home')
@ApiTags('HomePage')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }
}
