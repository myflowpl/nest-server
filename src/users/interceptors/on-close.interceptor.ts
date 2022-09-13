import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { endWith, fromEvent, Observable, share, switchMap, take, takeUntil, tap } from 'rxjs';

@Injectable()
export class OnCloseInterceptor implements NestInterceptor {

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    const request = context.switchToHttp().getRequest();

    const close$ = fromEvent(request, 'close');

    return next.handle().pipe(
      takeUntil(close$),
      endWith(''),
      take(1),
      // tap((res) => console.log('ON CLOSE END', request.url))
    );
  }

}


// const p = new Promise((resolve, reject) => {
//   // TODO async job
//   // succes resolve(data)
//   // error  reject(error)

//   // brak anulowania
//   // brak anulowania od strony fabryki (odpowiednika complete w observable)
//   // zwraca tylko jdedna wartosc
// })

// p.then(() => new Promise(() => {}))
// p.then(() => {})
// p.catch(() => { })

// const cold = new Observable((subscriber) => {
//   // CONSTRUCT
//   // TODO async job
//   subscriber.next({data: ''})
//   subscriber.error(new Error())
//   subscriber.complete()

//   return () => {
//     // DESTRUCT
//   }
// })

// const hot = cold.pipe(
//   share()
// )

// cold.pipe(
//   switchMap(() => hot)
// ).subscribe()

// const subscription = cold.subscribe(
//   (value) => {},
//   (err) => {},
//   () => {},
// )

// subscription.unsubscribe()

// cold.subscribe(
//   (value) => {},
//   (err) => {},
//   () => {},
// )
