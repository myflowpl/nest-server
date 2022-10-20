import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';

@Injectable()
export class ConfigService implements OnModuleInit, OnModuleDestroy {

  async onModuleInit() {
    // throw new Error('Method not implemented.');
  }

  async onModuleDestroy() {
    // throw new Error('Method not implemented.');
  }

  readonly DEBUG = true;
  readonly PORT = 3000;

}
