import { Injectable } from '@nestjs/common';
import { StoreService } from './store/store.service';
import Axios from 'axios';
import { Observable } from 'rxjs';


@Injectable()
export class AppService {

  constructor(
    // inject deps
    private store: StoreService,
  ) {}

  async getHello(): Promise<any> {
    return this.store.data;
  }

  request(url: string) {

    return new Observable(subscriber => {
      // constructor

      const controller = new AbortController();
  
      Axios.get(url, {signal: controller.signal})
        .then(res => {
          subscriber.next(res.data);
          subscriber.complete();
        })
        .catch(err => {
          subscriber.error(err);
        });

      return () => {
        // descructor
        controller.abort();
      }
    });

  }
}
 