import { Injectable } from '@nestjs/common';
import { resolve } from 'path';

@Injectable()
export class ConfigService {

  readonly DEBUG = true;
  readonly PORT = 3000;
}
