import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import Axios from 'axios';

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  request(url: string): Observable<string> {

    return new Observable(subscriber => {
      // CONSTRUCTOR
      
      const controller = new AbortController();


      Axios.get(url, { 
        signal: controller.signal
      })
      .then(res => {
        subscriber.next(res.data);
        subscriber.complete();
      })
      .catch(error => {
        subscriber.error(error);
      })

      return () => {
        // DESTRUCTOR
        console.log('DESTRUCT', url)
        controller.abort();
      }
    });
  }
}
