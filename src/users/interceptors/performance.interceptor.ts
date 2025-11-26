import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { catchError, EMPTY, map, Observable, of, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {



  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request: Request = context.switchToHttp().getRequest();

    // BEFORE hook (edit request)
    console.time('Request duration')
    console.log('Interceptor BEFORE' )

    return next.handle().pipe(
      // AFTER event (see the response)
      tap({

        next: (response) => console.log('next callback'), 
        complete: () => console.log('complete callback'),
        finalize: () => {
          console.timeEnd('Request duration');
          console.log('Interceptor AFTER', )
        }, 
      }),
      catchError((error) => of('Sorry we are unavailable')), // catch error
      map(response => response),    // AFTER hook (edit response)
    );


  }

}
