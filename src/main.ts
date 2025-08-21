import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MikroORM } from '@mikro-orm/core';
import { setupSwagger } from './utils/swagger.util';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const orm = app.get(MikroORM);

  await orm.getSchemaGenerator().updateSchema();

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
