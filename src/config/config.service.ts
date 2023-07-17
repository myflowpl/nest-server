import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ConfigService implements OnModuleInit {

    readonly DEBUG = true;
    readonly PORT = 3000;

    async onModuleInit() {
        // TODO init config properties

        // TODO add config validation
        
    }
}
