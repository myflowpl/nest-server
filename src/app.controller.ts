import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

export interface GetHelloResponse {
  message: string;
}

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {

    return {
      message: 'Welcome to my first NestJS app',
    };

    // return this.appService.getHello();
  }

  @Get('hello')
  create() {

    return {
      message: 'Hello endpoint welcome',
    };

    // return this.appService.getHello();
  }
}
