import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { expressApp } from './express/server';
import { ExpressAdapter, NestExpressApplication } from "@nestjs/platform-express";
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions, SwaggerCustomOptions } from '@nestjs/swagger';
import { LoggerMiddleware } from './users/middlewares/logger.middleware';

const expressAdapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, expressAdapter);

  // SWAGGER SETUP
  const config = new DocumentBuilder()
    .setTitle('Mój Projekt w Nest')
    .setDescription('Przykładowy projekt w Node.js i TypeScript')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions =  {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
  };

  const document = SwaggerModule.createDocument(app, config, options);

  const customOptions: SwaggerCustomOptions = {
    swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('docs', app, document, customOptions);
  // END OF SWAGGER SETUP

  await app.listen(3000);
}
bootstrap();
