import { HttpService } from '@nestjs/axios';
import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { delay, of, tap } from 'rxjs';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';

@Controller()
@ApiTags('App')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private config: ConfigService,
    private http: HttpService,
  ) {
    // console.log('Config', config);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('autocomplete')
  autocomplete(@Query('delay', ParseIntPipe) delayTime: number) {

    const data = ['test data', delayTime];

    console.log('AUTOCOMPLETE START', delayTime);

    return of(data).pipe(
      delay(delayTime * 1000),
      tap(() => console.log('AUTOCOMPLETE END', delayTime))
    )
  }

  @Get('big-data')
  bigData() {

    console.log('BIG DATA START')

    const request5$ = this.request('http://localhost:3000/autocomplete?delay=5');
    const request3$ = this.request('http://localhost:3000/autocomplete?delay=3');
    const request1$ = this.request('http://localhost:3000/autocomplete?delay=1');

    

  }

  request(url: string) {

    return this.http.get(url, {responseType: 'json'});
  }
}
