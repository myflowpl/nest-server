import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { endWith, fromEvent, Observable, take, takeUntil, tap } from 'rxjs';

@Injectable()
export class OnCloseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    
    // get request
    const request = context.switchToHttp().getRequest();
    
    console.log('INTERCEPT', request.url )

    // create close stream
    const close$ = fromEvent(request, 'close').pipe(
      tap(event => console.log('INTERCEPT CLOSE EVENT', request.url))
    );

    // pipe next with takeUntil(close$)
    return next.handle().pipe(
      takeUntil(close$),
      endWith(''),
      take(1),
    );
  }
}
