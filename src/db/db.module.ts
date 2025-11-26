import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'dns';
import { ConfigModule, ConfigService } from '../config';
import { Role, User } from '../users/entities/user.entity';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                type: 'sqlite',
                database: config.DB_NAME,
                entities: [User, Role],
            }),
        }),
    ],
    exports: [TypeOrmModule]
})
export class DbModule {}
