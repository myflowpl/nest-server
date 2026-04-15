import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '../config';
import { resolve } from 'path';

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'sqlite',
                database: config.DB_NAME,
                entities: [resolve(__dirname, '../**/*.entity{.ts,.js}')],
            })
        }),
    ],
    exports: [TypeOrmModule]
})
export class DbModule {}
