import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // BEFORE - MODIFY REQUEST
    console.time('TIMER');

    return next.handle().pipe(
      // AFTER - modify response
      tap({
        finalize: () => console.timeEnd('TIMER'),
      }),
      map(res => res),
    );

  }
}
