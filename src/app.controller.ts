import { Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';

export interface GetHelloResponse {
  message: string;
}

@Controller()
@ApiTags('App')
export class AppController {

  constructor(
    private appService: AppService,
    private store: StoreService,
    private config: ConfigService,
  ) {}

  @Get()
  getHello() {

    // return {
    //   message: 'Welcome to my first NestJS app',
    // };

    return this.appService.getHello();
  }

  @Get('hello')
  create() {

    return {
      message: 'Hello endpoint welcome',
    };

    // return this.appService.getHello();
  }
}
