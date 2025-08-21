import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';

export default defineConfig({
  extensions: [SeedManager],
  entities: ['dist/src/entities/*.entity.js'],
  entitiesTs: ['src/entities/*.entity.ts'],
  dbName: 'udemy_clone',
  user: 'postgres',
  password: '1234',
  host: 'localhost',
  port: 5432,
  debug: false,
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    emit: 'ts',
  },
});
