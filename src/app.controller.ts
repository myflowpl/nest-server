import { Controller, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { combineLatest, finalize, map, of, tap, delay } from 'rxjs';
import { OnCloseInterceptor } from './users/interceptors/on-close.interceptor';
import { AuthService } from './api-client';

@Controller()
@ApiTags('App')
@UseInterceptors(OnCloseInterceptor)
export class AppController {

  constructor(
    private readonly appService: AppService,
    private authApi: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('search')
  search() {
    console.log('DATA START');

    const req5$ = this.appService.request(5);
    const req1$ = this.appService.request(1);
    const req3$ = this.appService.request(3);
    
    const data$ = combineLatest([req5$, req1$, req3$]).pipe(
      map(data => data.join(' | ')),
      tap({
        next: (data) => console.log('COMBINED DATA', data),
        finalize: () => console.log('COMBINED DATA FINALIZE')
      })
    )

    return data$;

  }

  @Get('microservice')
  microservice(@Query('delay', ParseIntPipe) delayTime: number) {
    
    console.log('MICRO START', delayTime);

    return of(`RESPONSE OF ${delayTime}`).pipe(
      delay(delayTime*1000),
      tap({
        next: () => console.log('MICRO NEXT', delayTime),
        finalize: () => console.log('MICRO FINALIZE', delayTime),
      })
    );
  }

  @Get('service')
  async serviceLogin() {

    return this.authApi.login({
      email: 'piotr@myflow.pl',
      password: '!@#$',
    }).pipe(
      map(res => res.data),
    )

    // return {
    //   loginData,
    // }
    
  }
}
