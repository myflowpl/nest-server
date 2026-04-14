import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {


  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();
    
    // BEFORE
    console.log('BEFORE')
    console.time('Duration')

    return next.handle().pipe(
      // AFTER
      // tap(res => {
      //   console.log('AFTER', res);
      //   console.timeEnd('Duration')
      // }),
      tap({
        finalize: () => {
          console.log('AFTER');
          console.timeEnd('Duration')
        }
      }),

      map(res => res),

      // AFTER ERROR
      catchError((err) => {

        console.log('CATCH ERROR', err)
        return of('DUMMY DATA')
      })
    );
  }

}
