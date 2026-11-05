import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module.js';
import { ConfigService } from './config/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  // walidacja DTO w całej aplikacji
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  // SWAGGER SETUP
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Panel użytkowników')
    .setDescription('Nest + Prisma + PostgreSQL')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, { swaggerOptions: { persistAuthorization: true } });
  // END OF SWAGGER SETUP

  await app.listen(config.PORT);
}
await bootstrap();
