import { DocumentBuilder } from '@nestjs/swagger';

export function getSwaggerConfig() {
  return new DocumentBuilder()
    .setTitle('Dev social')
    .setDescription('Dev social API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
}
