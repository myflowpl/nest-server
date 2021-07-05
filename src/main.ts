import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { expressApp } from './express/server';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
// import { ConfigService } from './config';

const expressAdapter = new ExpressAdapter(expressApp);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, expressAdapter);
  
  app.setGlobalPrefix('api');

  // const config = new ConfigService();
  const options = new DocumentBuilder()
    .setTitle('Nest API Example')
    .setDescription('Przykładowy projekt w Node.js i TypeScript')
    .setVersion('1.0')
    .addTag('user')
    // .addBearerAuth({type: 'apiKey', in: 'header', name: config.TOKEN_HEADER_NAME})
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
