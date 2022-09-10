import { HttpService } from '@nestjs/axios';
import { Controller, Get, ParseIntPipe, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { combineLatest, delay, fromEvent, map, Observable, of, takeUntil, tap } from 'rxjs';
import { AppService } from './app.service';
import { OnCloseInterceptor } from './on-close.interceptor';
import Axios, {
  CancelTokenSource,
} from 'axios';
import { ConfigService } from './config';

@Controller()
@ApiTags('Main Page')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private http: HttpService,
    private config: ConfigService,
    ) {
      // console.log('CONFIG', config)
    }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('autocomplete')
  @UseInterceptors(OnCloseInterceptor)
  autocomplete(@Query('delay', ParseIntPipe) delayTime?: number) {

    const data = {data: 'extra test data', delayTime};

    console.log('DATA START', delayTime)

    return of(data).pipe(
      delay(delayTime),
      tap((event) => console.log('DATA END', delayTime)),
    )
  }

  @Get('big-data')
  @UseInterceptors(OnCloseInterceptor)
  bigData() {

    console.log('BIG DATA START')

    const request5s$ = this.request('http://localhost:3000/autocomplete?delay=5000');
    const request3s$ = this.request('http://localhost:3000/autocomplete?delay=3000');
    const request1s$ = this.request('http://localhost:3000/autocomplete?delay=1000');

    const data$ = combineLatest([request5s$, request3s$, request1s$]).pipe(
      tap(data => console.log('BIG DATA END', data))
    )

    return data$;
  }

  request(url: string) {

    // WORK AROUND bo nie działa unsubscribe na oficjalnym serwisie
    return new Observable(subscriber => {
      let cancelSource: CancelTokenSource;
      cancelSource = Axios.CancelToken.source();

      const axios = this.http.axiosRef;
      

      axios.get(url, {
        cancelToken: cancelSource.token,
      }).then(function(response) {
         subscriber.next(response);
         subscriber.complete();
      }).catch(err => {
        subscriber.error(err);
      });

      // cancel the request
      return () => {
        cancelSource.cancel();
      }
    });

    // TODO sprawdzic bo powinno działac w ten sposob
    return this.http.get(url, {responseType: 'json'}).pipe(
      // map(res => res.data)
    );
  }
}
