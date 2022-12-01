import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {

  constructor(
    // inject stuff
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // BEFORE modify request
    const req = context.switchToHttp().getRequest();

    console.time('TIME')

    return next.handle().pipe(
      
      // AFTER modify response
      map(res => res),

      // catch errors
      catchError(err => of(err)),

      tap({
        finalize: () => console.timeEnd('TIME'),
      }),
    );
  }
}
