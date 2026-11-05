import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, delay, map, Observable, of, tap, throwError, pipe } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();

    // BEFORE
    console.log('INTERCEPT BEFORE', request.url)
    // TODO map request 
    console.time('Req Time')

    const response$ = next.handle().pipe(
      tap({

        finalize: () => console.timeEnd('Req Time')
      }),
      // catchError(err => {
      //   // CATCH ERROR & return response

      //   // return success - map error to next
      //   return of('ERROR: '+err.message)

      //   // return error anyway
      //   // return throwError(() => err);

      //   // retry controller method after request edit
      //   // edit request

      //   // retry controller
      //   return next.handle();

      //   // TODO check how to do it
      //   // return pipe(
      //   //   delay(5000), 
      //   //   next.handle()
      //   // )

      // }),
      map(res => {
        // AFTER
        console.log('INTERCEPT AFTER', request.url)
        // TODO map the response
        return res;
      }),
    );

    return response$;

    // response$.subscribe((data)=> console.log('res', data))
  }
}
