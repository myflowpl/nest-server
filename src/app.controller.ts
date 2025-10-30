import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { StoreService } from './store/store.service';
import { ConfigService } from './config';
import { Client, ClientProxy, Transport } from '@nestjs/microservices';

@ApiTags('App')
@Controller()
export class AppController {

  constructor(
    private readonly appService: AppService,
    private readonly storeService: StoreService,
    private readonly config: ConfigService,
  ) {}

  @Client({ transport: Transport.TCP, options: { port: 3001 }})
  client: ClientProxy;

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('name')
  name(): string {
    // console.log('FROM STORE', this.storeService.findOneBy())
    return 'test';
  }

  @Get('sum')
  async sum(@Query('number') number: string) {

    const patter = { cmd: 'sum' };

    const array = (number || '').split(',').map(n => parseInt(n)).filter(n => !!n);

    // send it to microservice

    // event based
    this.client.emit<number>('user_created', array);

    // request/response based
    const sum = await this.client.send(patter, array);

    return sum;

  }
}
