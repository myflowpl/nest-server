import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { resolve } from 'path';
import 'dotenv/config';
import { IsBoolean, IsNumber, IsUrl, validateOrReject } from 'class-validator';
import { mkdir, stat } from 'fs/promises';

export const joinUrl = (...paths) => paths.join('/');

@Injectable()
export class ConfigService implements OnModuleInit {

  private logger = new Logger('ConfigService')

  @IsBoolean()
  readonly DEBUG = process.env.DEBUG === 'true';

  @IsNumber()
  readonly PORT = parseInt(process.env.PORT, 10);

  @IsUrl({require_tld: false})
  readonly DOMAIN = process.env.DOMAIN;

  readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR);
  readonly JWT_SECRET = process.env.JWT_SECRET;

  readonly DB_NAME = resolve(this.STORAGE_DIR, 'nest.db');

  readonly STORAGE_TMP = resolve(this.STORAGE_DIR, 'tmp');
  readonly STORAGE_PHOTOS = resolve(this.STORAGE_DIR, 'photos');

  readonly STORAGE_ASSETS = resolve(this.STORAGE_DIR, 'assets');
  readonly STORAGE_THUMBS = resolve(this.STORAGE_ASSETS, 'thumbs');

  readonly PHOTOS_BASE_PATH = joinUrl(this.DOMAIN, 'thumbs');
  readonly PHOTOS_DOWNLOAD_PATH = joinUrl(this.DOMAIN, 'photos/download');

  async onModuleInit() {

    // validation of config
    await validateOrReject(this).catch(errors => {
      errors.forEach(e => this.logger.error(Object.values(e.constraints).join(', ')))
      throw errors;
    });

    // validation of storage dir existence
    await stat(resolve(this.STORAGE_DIR, '.storage')).catch((err) => {
      this.logger.error(`STORAGE_DIR location should exists !!! tested: ${this.STORAGE_DIR}`)
      throw err;
    })

    // validation storage dir structure
    await mkdir(this.STORAGE_TMP, { recursive: true });
    await mkdir(this.STORAGE_PHOTOS, { recursive: true });
    await mkdir(this.STORAGE_ASSETS, { recursive: true });
    await mkdir(this.STORAGE_THUMBS, { recursive: true });
  }
}
