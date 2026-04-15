import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';
// import { AppModule } from '../app.module';
import { ConfigModule, ConfigService } from '../config';
import { AppModule } from '../app.module';

const buildDataSource = async () => {

  const app = await NestFactory.createApplicationContext(ConfigModule, {logger: false});
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
