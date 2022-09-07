import { HttpService } from '@nestjs/axios';
import { Controller, Get, ParseIntPipe, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { combineLatest, delay, fromEvent, map, Observable, of, takeUntil, tap } from 'rxjs';
import { AppService } from './app.service';
import { OnCloseInterceptor } from './on-close.interceptor';
import Axios, {
  // AbortController,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  CancelTokenSource,
} from 'axios';

@Controller()
@ApiTags('Main Page')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private http: HttpService,
    ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('autocomplete')
  @UseInterceptors(OnCloseInterceptor)
  autocomplete(@Query('delay', ParseIntPipe) delayTime?: number) {

    const data = {id: delayTime, name: 'test dla delay '};

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

    const request5000$ = this.request(5000);
    const request3000$ = this.request(3000);
    const request1000$ = this.request(2000);

    const data$ = combineLatest([request5000$, request3000$, request1000$]).pipe(
      tap(data => console.log('BIG DATA END', data))
    )

    return data$;
  }

  request(delay: number) {

    // WORK AROUND bo nie działa unsubscribe na oficjalnym serwisie
    return new Observable(subscriber => {
      let cancelSource: CancelTokenSource;
      cancelSource = Axios.CancelToken.source();

      const axios = this.http.axiosRef;
      

      axios.get('http://localhost:3000/autocomplete?delay='+delay, {
        cancelToken: cancelSource.token,
      }).then(function(response) {
         subscriber.next(response);
         subscriber.complete();
      }).catch(err => subscriber.error(err));

      // cancel the request
      return () => {
        cancelSource.cancel();
      }
    });

    // TODO sprawdzic bo powinno działac w ten sposob
    return this.http.get('http://localhost:3000/autocomplete?delay='+delay, {responseType: 'json'}).pipe(
      // map(res => res.data)
    );
  }
}
