import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './config';
import { ClassSerializerInterceptor } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))


  const config = app.get(ConfigService);

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
