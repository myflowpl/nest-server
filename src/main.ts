import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';
import { ConfigService } from './config';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))


  const config = app.get(ConfigService);

  app.useStaticAssets(config.STORAGE_ASSETS);

  // SWAGGER SETUP
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Mój Projekt w Nest')
    .setDescription('Przykładowy projekt w Node.js i TypeScript')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const options: SwaggerDocumentOptions =  {
    operationIdFactory: ( controllerKey: string, methodKey: string ) => controllerKey+'_'+methodKey
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);

  SwaggerModule.setup('docs', app, document, { swaggerOptions: { persistAuthorization: true },  });
  // END OF SWAGGER SETUP


  await app.listen(config.PORT);
}
bootstrap();
