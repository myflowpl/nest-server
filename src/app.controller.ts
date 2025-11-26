import { Controller, Get, Param, ParseIntPipe, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from './store/store.service';
import { ConfigService } from './config';
import { combineLatest, delay, map, Observable, of, tap } from 'rxjs';
import { OnCloseInterceptor } from './users/interceptors/on-close.interceptor';

@Controller()
@ApiTags('App')
@UseInterceptors(OnCloseInterceptor)
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private config: ConfigService,
  ) {
    // console.log('Store Service', this.config);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  /**
   * Backed For Froendend
   */
  @Get('data')
  data() {
    console.log('Data START', )
    const req1$ = this.appService.request('http://localhost:3000/microservice/4');
    const req2$ = this.appService.request('http://localhost:3000/microservice/2');
    const req3$ = this.appService.request('http://localhost:3000/microservice/6');

    const data$ = combineLatest([
      req1$, req2$, req3$
    ]).pipe(
      // transform data
      map(responses => responses),
    );

    return data$.pipe(
      tap({ next: res => console.log('Data RESP', res) })
    );
  }

  /**
   * Microserice with delay
   */
  @Get('microservice/:delayTime')
  microservice(@Param('delayTime', ParseIntPipe) delayTime: number) {
    
    return new Observable(subscriber => {
      
      // constructor
      const response = `Response with delay ${delayTime}s`;
      console.log('Microservice START', delayTime);
      
      // do async job
      const id = setTimeout(
        () => { 
          subscriber.next(response);
          subscriber.complete();
        }, 
        delayTime*1000
      );

      // destructor
      return () => {
        console.log('Microservice DESTROY', delayTime)
        clearTimeout(id);
      }
    });

  }
}
