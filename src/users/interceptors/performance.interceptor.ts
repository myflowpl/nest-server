import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // BEFORE - modify request

    console.time('TIMER')

    return next.handle().pipe(
      // AFTER - modify response
      map(res => res),
      tap(() => console.timeEnd('TIMER'))
    );
  }
}
