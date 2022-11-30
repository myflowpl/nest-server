import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {

  constructor(
    // inject deps
    
  ) {}

  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
