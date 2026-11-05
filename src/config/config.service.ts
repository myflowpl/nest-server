import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import 'dotenv/config'
import { MinLength } from 'class-validator';

@Injectable()
export class ConfigService {

  readonly DEBUG = process.env.DEBUG === 'true';
  readonly PORT = parseInt(process.env.PORT, 10);
  readonly DOMAIN = process.env.DOMAIN;
  readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR);
  
  // @MinLength(3)
  readonly JWT_SECRET = process.env.JWT_SECRET;


}
