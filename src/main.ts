import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { expressApp } from './express/server';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './config';
import { PerformanceInterceptor } from './users/interceptors/performance.interceptor';
// import {
//   FastifyAdapter,
//   NestFastifyApplication,
// } from '@nestjs/platform-fastify';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, 
    // new ExpressAdapter(expressApp),
    // new FastifyAdapter()
  );

  app.setBaseViewsDir(join(__dirname, 'views'));
  
  app.setViewEngine('hbs');

  const config = app.get(ConfigService);
  
  // app.useGlobalInterceptors(
  //   app.get(PerformanceInterceptor)
  // );

  // SWAGGER SETUP
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Mój Projekt w Nest')
  .setDescription('Przykładowy projekt w Node.js i TypeScript')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('docs', app, document, { swaggerOptions: { persistAuthorization: true } });
  // END OF SWAGGER SETUP


  await app.listen(config.PORT);

}
bootstrap();
