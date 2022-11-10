import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
import { AppModule } from '../app.module';
import { ConfigService } from '../config';

const buildDataSource = async () => {
  
  const app = await NestFactory.createApplicationContext(AppModule, {logger: false});
  const config = app.get(ConfigService);

  const connectionConfig: SqliteConnectionOptions = {
    "type": "sqlite",
    "database": config.DB_NAME,
    "entities": ["src/**/*.entity.ts"],
    "migrationsTableName": "migrations",
    "migrations": ["src/db/migrations/*.ts"],
  };

  return new DataSource(connectionConfig);
};

export default buildDataSource();