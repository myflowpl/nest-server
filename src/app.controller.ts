import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
@ApiTags('App')
export class AppController {

  constructor(
    private readonly appService: AppService
  ) {}

  @Get()
  async getHello(): Promise<string> {

    const res = await this.appService.getHello();

    return res;
  }
}
