import { Injectable } from '@nestjs/common';
import { StoreService } from './store/store.service';
import { Observable } from 'rxjs';
import Axios from 'axios';

@Injectable()
export class AppService {

  constructor(
    private store: StoreService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  request(delay: number): Observable<string> {

    const url = 'http://localhost:3000/microservice?delay='+delay;
    
    return new Observable(subscriber => {
      // constructor

      const controller = new AbortController();
      
      Axios.get(url, { signal: controller.signal })
      .then(res => {
        subscriber.next(res.data);
        subscriber.complete();
      }).catch(error => {
        subscriber.error(error);
      });

      // destructor
      return () => {
        controller.abort();
      }
    });
  }
}
