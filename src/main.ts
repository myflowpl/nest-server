import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './config';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  
  // SWAGGER SETUP
  const swaggerConfig = new DocumentBuilder()
  .setTitle('My Nest Project')
  .setDescription('REST API with Node.js & TypeScript')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, { swaggerOptions: { persistAuthorization: true } });
  // END OF SWAGGER SETUP

  await app.listen(config.PORT);
}
bootstrap();
