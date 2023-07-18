import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config';
import { resolve } from 'path';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'sqlite',
                database: config.DB_NAME,
                entities: [resolve(__dirname, '../**/*.entity{.ts,.js}')]
            })
        }),
    ],
    exports: [TypeOrmModule],
})
export class DbModule {}
