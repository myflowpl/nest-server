import { HttpService } from '@nestjs/axios';
import { Controller, Get, ParseIntPipe, Query, Req, Res, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { delay, of, map, tap, Observable, Subject, takeUntil, endWith, combineLatest } from 'rxjs';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';
import Axios from 'axios';
import { Request } from 'express';
import { setUncaughtExceptionCaptureCallback } from 'process';
import { OnCloseInterceptor } from './users/interceptors/on-close.interceptor';

@Controller('home')
@ApiTags('HomePage')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private config: ConfigService,
    private http: HttpService,
  ) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('data')
  @UseInterceptors(OnCloseInterceptor)
  data(@Query('t', ParseIntPipe) time: number) {

    const data = `Data from ${time} endpoint`;

    console.log('DATA', time, 'START')

    return of(data).pipe(
      delay(time*1000),
      tap(() => console.log('DATA', time, 'END'))
    );
  }

  @Get('autocomplete')
  @UseInterceptors(OnCloseInterceptor)
  autocomplete() {

    const request5$ = this.request('http://localhost:3000/home/data?t=5');
    const request3$ = this.request('http://localhost:3000/home/data?t=3');
    const request1$ = this.request('http://localhost:3000/home/data?t=1');

    return combineLatest([
      request5$,
      request3$,
      request1$,
    ]).pipe(
      map(requests => requests.join(' | '))
    );
  }

  request(url: string) {

    // WORK AROUND bo nie działa unsubscribe na oficjalnym serwisie
    return new Observable(subscriber => {

      const axios = this.http.axiosRef;

      const cancelSource = Axios.CancelToken.source();

      axios.get(url, {
        cancelToken: cancelSource.token,
      }).then(function(response) {
         subscriber.next(response.data);
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
    return this.http.get(url).pipe(
      map(res => res.data)
    );
  }
}
