import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { resolve } from 'path';
import 'dotenv/config';
import { IsBoolean, IsNumber, IsUrl, MinLength, validateOrReject } from 'class-validator';

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

    async onModuleInit() {
        
        // TODO init config properties

        // add config validation
        await validateOrReject(this).catch(errors => {
            errors.forEach(e => this.logger.error(Object.values(e.constraints).join(', ')));

            this.logger.warn('Check if you created .env file in the root of your project')

            throw errors;
        })

        // TODO validate storage file structure
        
    }
}
