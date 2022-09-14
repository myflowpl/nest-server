import { DataSource } from 'typeorm';
// import { SqliteConnectionOptions } from 'typeorm/driver/sqlite/SqliteConnectionOptions';

const source = new DataSource({
  "type": "sqlite",
  "database": "./storage/nest.db",
  "entities": ["src/**/*.entity.ts"],
  "migrationsTableName": "migrations",
  "migrations": ["src/db/migrations/*.ts"],
});

export default source;
