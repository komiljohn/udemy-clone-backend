import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { SeedManager } from '@mikro-orm/seeder';
import type { ConfigService } from '@nestjs/config';

export function mikroOrmConfigFactory(
  configService: ConfigService,
): MikroOrmModuleOptions {
  return {
    extensions: [SeedManager],
    entitiesTs: ['src/entities/index.ts'],
    driver: PostgreSqlDriver,
    dbName: configService.getOrThrow<string>('DB_NAME'),
    user: configService.getOrThrow<string>('DB_USER'),
    password: configService.getOrThrow<string>('DB_PASSWORD'),
    host: configService.getOrThrow<string>('DB_HOST'),
    port: configService.getOrThrow<number>('DB_PORT'),
    debug: false,
    autoLoadEntities: true,
    migrations: {
      path: 'dist/migrations',
      pathTs: 'src/migrations',
      emit: 'ts',
    },
  };
}
