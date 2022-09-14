import { Injectable, OnModuleInit } from '@nestjs/common';
import { resolve } from 'path';
import 'dotenv/config'; 
import { MinLength, validateOrReject } from 'class-validator';
import { mkdir, stat } from 'fs/promises';

@Injectable()
export class ConfigService implements OnModuleInit {

  readonly DEBUG = process.env.DEBUG === 'true';

  readonly PORT = parseInt(process.env.PORT, 10) || 3333;

  readonly DOMAIN = process.env.DOMAIN;

  readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR || '');

  @MinLength(3)
  readonly JWT_SECRET = process.env.JWT_SECRET;

  readonly DB_NAME = resolve(this.STORAGE_DIR, 'nest.db')


  async onModuleInit() {

    await validateOrReject(this).catch(errors => {
      console.dir(errors)
      throw errors;
    })

    
    // check if storage dir root exists
    const storageRoot = await stat(this.STORAGE_DIR).catch((e) => null);
    if (!storageRoot) {
      throw new Error(`STORAGE_DIR location should exist !!! Storage location tested: ${this.STORAGE_DIR}`);
    }

    // create storage schema
    // await mkdir(this.STORAGE_TMP, { recursive: true });
    // await mkdir(this.STORAGE_PHOTOS, { recursive: true });
    // await mkdir(this.STORAGE_ASSETS, { recursive: true });
    // await mkdir(this.STORAGE_THUMBS, { recursive: true });
    
  }
}
