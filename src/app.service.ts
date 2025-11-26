import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import Axios from 'axios'

@Injectable()
export class AppService {

  getHello(): string {
    return 'Hello World!';
  }

  request(url: string): Observable<string> {

    return new Observable(subscriber => {

      // Constructor
      console.log('Service CON', url.replace('http://localhost:3000', ''));

      const controller = new AbortController();
      Axios.get(url, { signal: controller.signal})
        .then(res => {
          subscriber.next(res.data);
          subscriber.complete();
        })
        .catch(error => {
          subscriber.error(error);
        });

      // Destructor
      return () => {
        console.log('Service DES', url.replace('http://localhost:3000', ''))
        controller.abort();
      }

    });
  }
}

