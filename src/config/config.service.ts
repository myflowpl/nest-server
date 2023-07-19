import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { resolve } from 'path';
import 'dotenv/config';
import { IsBoolean, IsNumber, IsUrl, MinLength, validateOrReject } from 'class-validator';
import { mkdir, stat } from 'fs/promises';

export const joinUrl = (...paths) => paths.join('/');

@Injectable()
export class ConfigService implements OnModuleInit {

    protected logger = new Logger('ConfigService');

    @IsBoolean()
    readonly DEBUG = process.env.DEBUG === 'true';

    @IsNumber()
    readonly PORT = parseInt(process.env.PORT, 10);

    @IsUrl({require_tld: false})
    readonly DOMAIN = process.env.DOMAIN;

    readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR || '');

    @MinLength(5)
    readonly JWT_SECRET = process.env.JWT_SECRET;

    readonly DB_NAME = resolve(this.STORAGE_DIR, 'nest.db');

    // photos module
    readonly STORAGE_TMP = resolve(this.STORAGE_DIR, 'tmp');
    readonly STORAGE_PHOTOS = resolve(this.STORAGE_DIR, 'photos');

    readonly STORAGE_ASSETS = resolve(this.STORAGE_DIR, 'assets');
    readonly STORAGE_THUMBS = resolve(this.STORAGE_ASSETS, 'thumbs');

    readonly PHOTOS_DOMAIN = 'http://localhost:3000';
    readonly PHOTOS_BASE_PATH = joinUrl(this.PHOTOS_DOMAIN, 'thumbs');
    readonly PHOTOS_DOWNLOAD_PATH = joinUrl(this.PHOTOS_DOMAIN, 'photos/download');


    async onModuleInit() {
        
        // TODO init config properties

        // add config validation
        await validateOrReject(this).catch(errors => {
            errors.forEach(e => this.logger.error(Object.values(e.constraints).join(', ')));

            this.logger.warn('Check if you created .env file in the root of your project')

            throw errors;
        })

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
