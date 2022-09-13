import { HttpService } from '@nestjs/axios';
import { Controller, Get, ParseIntPipe, Query, Render, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { catchError, combineLatest, delay, map, Observable, of, tap } from 'rxjs';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';
import { OnCloseInterceptor } from './users/interceptors/on-close.interceptor';
import Axios from 'axios';

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
  @UseInterceptors(OnCloseInterceptor)
  autocomplete(@Query('delay', ParseIntPipe) delayTime: number) {

    const data = ['test data', delayTime];

    console.log('AUTOCOMPLETE START', delayTime);

    return of(data).pipe(
      delay(delayTime * 1000),
      tap(() => console.log('AUTOCOMPLETE END', delayTime))
    )
  }

  @Get('big-data')
  @UseInterceptors(OnCloseInterceptor)
  // @Render('view/photos/list')
  bigData() {

    console.log('BIG DATA START')

    const request5$ = this.request('http://localhost:3000/autocomplete?delay=5').pipe(
      catchError(err => of([]))
    );

    const request3$ = this.request('http://localhost:3000/autocomplete?delay=3').pipe(
      catchError(err => of([]))
    );

    const request1$ = this.request('http://localhost:3000/autocomplete?delay=1').pipe(
      catchError(err => of([]))
    );

    const data$ = combineLatest([request5$, request3$, request1$]).pipe(
      map(([data5, data3, data1]) => {
        return [...data1, ...data5, ...data3];
      }),
      catchError(err => of(['fake data'])),
      tap(() => console.log('BIG DATA END'))
    )

    return data$;
  }

  request(url: string) {

    // WORK AROUND bo nie działa unsubscribe na oficjalnym serwisie
    return new Observable<any[]>(subscriber => {
      
      const cancelSource = Axios.CancelToken.source();

      const axios = this.http.axiosRef;


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

    return this.http.get<any[]>(url).pipe(
      map(res => res.data),
    );
  }
}
