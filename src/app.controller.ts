import { Controller, Get, Logger, ParseIntPipe, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { combineLatest, delay, endWith, map, of, Subject, take, takeUntil, tap } from 'rxjs';
import { AppService } from './app.service';
import { ConfigService } from './config';
import { StoreService } from './store/store.service';
import { OnCloseInterceptor } from './users/interceptors/on-close.interceptor';

@Controller('')
@ApiTags('App')
export class AppController {

  logger = new Logger('MICROSERVICE')

  constructor(
    private readonly appService: AppService,
    private storeService: StoreService,
    private config: ConfigService,
  ) {
    // console.log('CONFIG', config)
  }

  @Get('')
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('microservice')
  microservice(
    @Query('delay', ParseIntPipe)  delayTime: number, 
    @Req() request: Request
  ) {

    const close$ = new Subject();

    request.on('close', () => {
      this.logger.error('ON CLOSE');
      close$.next(true);
    })
 
    this.logger.warn('START') 

    return of(`RESPONSE FROM ${delayTime}`).pipe(
      delay(delayTime*1000), 
      takeUntil(close$),
      tap({
        next: () => this.logger.debug('NEXT'),
        finalize: () => this.logger.debug('FINALIZE'),
      }),
      endWith(''),
      take(1), 
    );
  }

  @Get('data')
  @UseInterceptors(OnCloseInterceptor)
  data() {

    const req5$ = this.appService.request('http://localhost:3000/microservice?delay=5');
    const req3$ = this.appService.request('http://localhost:3000/microservice?delay=3');
    const req1$ = this.appService.request('http://localhost:3000/microservice?delay=1');

    const data$ = combineLatest([req5$, req3$, req1$]).pipe(
      tap({
        next: () => console.log('DATA NEXT'),
        finalize: () => console.log('DATA FINALIZE'),
      })
    )

    return data$;

  }
}
