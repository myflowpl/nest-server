import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'node:path';
import { AppModule } from './app.module.js';
import { ConfigService } from './config/index.js';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = app.get(ConfigService);

  // strona do „klikania” zdarzeń WebSocket: http://localhost:3000/ui/
  app.useStaticAssets(join(process.cwd(), 'public'), { prefix: '/ui' });

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
