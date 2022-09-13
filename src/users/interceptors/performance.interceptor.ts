import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';
import { StoreService } from '../../store/store.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {

  constructor(
    private store: StoreService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // before logic
    const request = context.switchToHttp().getRequest();

    console.time('Request duration')
    console.log('INTERCEPT BEFORE')

    return next.handle().pipe(
      tap((res) => {
        // AFTER logic ala console.log()
        console.timeEnd('Request duration')
        console.log('INTERCEPT AFTER')
      }),

      map(res => {
        // AFTER logic
        // mapowanie response
        return res;
      }),
    );
  }

}
