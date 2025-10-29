import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { catchError, map, Observable, of, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {


  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request: Request = context.switchToHttp().getRequest();

    // BEFORE hook, modify the request
    console.time('Duration')

    // run controller or next interceptor
    const response$ = next.handle().pipe(

      // AFTER hook map the response
      map(response => response),

      // watch the events
      tap({
        finalize: () => {
          console.timeEnd('Duration')
        }
      })
    );

    return response$;
  }

}




// @Injectable()
// export class PerformanceInterceptor implements NestInterceptor {


//   intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

//     const request: Request = context.switchToHttp().getRequest();

//     // BEFORE hook, modify the request

//     // REPLACE controller
//     if(!request.payload) {
//       return of({messag: 'my response from interceptor'})
//     }

//     const next$ = next.handle();

//     // subscirbne to the streem
//     // next$.subscribe({
//     //   next: (value) => console.log('next', value)
//     // })

//     // run controller or next interceptor
//     const response$ = next$.pipe(

//       // AFTER hook map the response
//       map(response => response),

//       // intercept error response
//       catchError((err) => of(err)),

//       // watch te response
//       tap({
//         finalize: () => {
//           console.log('requesty is DONE')
//         }
//       })
//     );

//     return response$;
//   }

// }