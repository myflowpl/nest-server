import { Controller, Get, ParseIntPipe, Query, Req, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { combineLatest, delay, endWith, of, Subject, take, takeUntil, tap } from 'rxjs';
import { AppService } from './app.service';
import { OnCloseInterceptor } from './users/interceptors/on-close.interceptor';

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

  @Get('microservice')
  microservice(
    @Query('delay', ParseIntPipe) delayTime: number,
    @Req() request: Request,
  ) {

    const close$ = new Subject();

    request.on('close', () => {
      console.log('MICRO Cancel', delayTime)
      close$.next(true);
    })

    console.log('MICRO Start', delayTime)

    return of(`Response FROM ${delayTime}`).pipe(
      delay(delayTime*1000),
      takeUntil(close$),
      tap({
        next: () => console.log('MICRO End', delayTime),
        finalize: () => console.log('MICRO FINAL', delayTime),
      }),
      endWith(''),
      take(1)
    )
  }

  @Get('search')
  @UseInterceptors(OnCloseInterceptor)
  search() {

    const req5$ = this.appService.request(`http://localhost:3000/microservice?delay=5`);
    const req3$ = this.appService.request(`http://localhost:3000/microservice?delay=3`);
    const req1$ = this.appService.request(`http://localhost:3000/microservice?delay=1`);

    const data$ = combineLatest([req5$, req3$, req1$])
    
    return data$;
  }
}
