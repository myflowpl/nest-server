import { Injectable } from '@nestjs/common';
import { StoreService } from './store/store.service';

@Injectable()
export class AppService {

  constructor(
    private store: StoreService,
  ) {}

  getHello(): string {
    // this.store.
    return 'Hello World!';
  }
}
