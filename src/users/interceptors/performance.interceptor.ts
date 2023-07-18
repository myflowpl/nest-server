import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {

  constructor(
    // todo inject services
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();

    // BEFORE mutate request

    console.time('Request duration');

    return next.handle().pipe(
      
      // AFTER mutate resonse
      map(response => response),
      tap({
        finalize: () => console.timeEnd('Request duration')
      })
    );
  }

}
