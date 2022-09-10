import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { endWith, fromEvent, Observable, takeUntil, tap } from 'rxjs';

@Injectable()
export class OnCloseInterceptor implements NestInterceptor {
  
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();

    const close$ = fromEvent(request, 'close')

    return next.handle().pipe(
      takeUntil(close$), 
      endWith('')
    );
  }
}
