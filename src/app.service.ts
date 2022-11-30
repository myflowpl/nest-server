import { Injectable } from '@nestjs/common';
import { StoreService } from './store/store.service';

@Injectable()
export class AppService {

  constructor(
    // inject deps
    private store: StoreService,
  ) {}

  async getHello(): Promise<any> {
    return this.store.data;
  }
}
 