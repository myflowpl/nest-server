import { Injectable } from '@nestjs/common';
import { resolve } from 'path';
import 'dotenv/config'

@Injectable()
export class ConfigService {

    readonly DEBUG = process.env.DEBUG === 'true';
    readonly PORT = parseInt(process.env.PORT || '0', 10);
    readonly DOMAIN = process.env.DOMAIN;
    readonly STORAGE_DIR = resolve(process.env.STORAGE_DIR || '');
    readonly JWT_SECRET = process.env.JWT_SECRET;

    readonly DB_NAME = resolve(this.STORAGE_DIR, 'nest.db');


    async onModuleInit() {
        // console.log('init config async')
    }

    async onModuleDestroy() {
        // console.log('destroy config async 2', )
    }
}
