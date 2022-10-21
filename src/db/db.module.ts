import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { ConfigModule, ConfigService } from '../config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
          return {
            type: 'sqlite',
            database: config.DB_NAME,
            entities: [resolve(__dirname, '../**/*.entity{.ts,.js}')],
          }
      },
    })
  ],
  exports: [TypeOrmModule],
})
export class DbModule {}
