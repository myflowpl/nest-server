import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // before logic
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((res) => {
        // AFTER logic ala console.log()

      }),

      map(res => {
        // AFTER logic
        // mapowanie response
        return res;
      }),
    );
  }

}
