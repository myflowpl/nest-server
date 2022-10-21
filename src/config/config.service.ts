import 'dotenv/config'
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { resolve } from 'path';
import { IsBoolean, IsNumber, validateOrReject } from 'class-validator';
import { mkdir, stat } from 'fs/promises';

export const joinUrl = (...paths) => paths.join('/');

@Injectable()
export class ConfigService implements OnModuleInit, OnModuleDestroy {

  @IsBoolean()
  readonly DEBUG = process.env.DEBUG === 'true';

  @IsNumber()
  readonly PORT = parseInt(process.env.PORT, 10);
  
  readonly DOMAIN = process.env.DOMAIN;
  readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR);

  readonly JWT_SECRET = process.env.JWT_SECRET;

  readonly DB_NAME = resolve(this.STORAGE_DIR, 'nest.db')

  readonly STORAGE_TMP = resolve(this.STORAGE_DIR, 'tmp');
  readonly STORAGE_PHOTOS = resolve(this.STORAGE_DIR, 'photos');

  readonly STORAGE_ASSETS = resolve(this.STORAGE_DIR, 'assets');
  readonly STORAGE_THUMBS = resolve(this.STORAGE_ASSETS, 'thumbs');

  readonly PHOTOS_DOMAIN = 'http://localhost:3000';
  readonly PHOTOS_BASE_PATH = joinUrl(this.PHOTOS_DOMAIN, 'thumbs');
  readonly PHOTOS_DOWNLOAD_PATH = joinUrl(this.PHOTOS_DOMAIN, 'photos/download');


  async onModuleInit() {

    await validateOrReject(this).catch(errors => {
      console.log(errors)
      throw errors;
    });

    // check if storage dir root exists
    const storageRoot = await stat(this.STORAGE_DIR).catch((e) => null);
    if (!storageRoot) {
      throw new Error(`STORAGE_DIR location should exist !!! Storage location tested: ${this.STORAGE_DIR}`);
    }

    // create storage schema
    await mkdir(this.STORAGE_TMP, { recursive: true });
    await mkdir(this.STORAGE_PHOTOS, { recursive: true });
    await mkdir(this.STORAGE_ASSETS, { recursive: true });
    await mkdir(this.STORAGE_THUMBS, { recursive: true });
  }

  async onModuleDestroy() {
    // throw new Error('Method not implemented.');
  }
}
