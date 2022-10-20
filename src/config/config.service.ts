import 'dotenv/config'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { resolve } from 'path';

@Injectable()
export class ConfigService implements OnModuleInit, OnModuleDestroy {

  readonly DEBUG = process.env.DEBUG === 'true';
  readonly PORT = parseInt(process.env.PORT, 10);
  readonly DOMAIN = process.env.DOMAIN;
  readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR);

  readonly JWT_SECRET = process.env.JWT_SECRET;

  async onModuleInit() {
    // throw new Error('Method not implemented.');
  }

  async onModuleDestroy() {
    // throw new Error('Method not implemented.');
  }
}
