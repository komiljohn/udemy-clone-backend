import { defineConfig } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  extensions: [SeedManager],
  entities: isProd ? ['dist/src/entities/*.entity.js'] : ['src/entities/*.entity.ts'],
  dbName: process.env.DB_NAME || 'udemy_clone',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '1234',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  debug: !isProd,
  migrations: {
    path: isProd ? 'dist/migrations' : 'src/migrations',
    emit: isProd ? 'js' : 'ts',
  },
});

