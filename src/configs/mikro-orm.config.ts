import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import type { ConfigService } from '@nestjs/config';

export function mikroOrmConfigFactory(
  configService: ConfigService,
): MikroOrmModuleOptions {
  return {
    entities: ['dist/entities/*.entity.js'],
    entitiesTs: ['src/entities/*.entity.ts'],
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
