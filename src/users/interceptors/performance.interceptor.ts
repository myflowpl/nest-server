import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Request } from 'express';
import { catchError, EMPTY, map, Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {


  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request: Request = context.switchToHttp().getRequest();

    // BEFORE hook (edit request)

    return next.handle().pipe(
      tap({

        next: (response) => console.log('response event', response), // AFTER event (see the response)
        complete: () => console.log('complete request')
      }),
      catchError((error) => EMPTY), // catch error
      map(response => response),    // AFTER hook (edit response)
    );


  }

}
