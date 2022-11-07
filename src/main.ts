import { NestFactory } from '@nestjs/core';
// import { Request } from 'express';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { expressApp } from './express/server';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './config';
import { join } from 'path';

async function bootstrap() {

  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(expressApp));

  const config = app.get(ConfigService);

  app.useStaticAssets(config.STORAGE_ASSETS);

  app.setBaseViewsDir(join(__dirname, 'views'));
  app.setViewEngine('hbs');

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

// const r: Request = {} as Request;
// r.url;

// console.log('START DECORATRS CLASS')

// function Log(label) {
//   return (target, key, descriptor) => {

//     console.log(`LOG ${label}: ${key} was decorated!`, label, target, key, descriptor);
 
//     const orgFn = descriptor.value;
 
//     descriptor.value = function(...args: unknown[]) {
//       console.log(` ${key} function logic replaced`)
 
//       const data = orgFn.call(this, ...args)
 
//       console.log(` ${key} function logic wrapped after`, data)
 
//       return data;
//     }
//   };
// }
 
// console.log('DEFINE CLASS')
// class P {

//   @Log('DEBUG')
//   @Log('LOG')
//   foo(ar1, art2) {
//     console.log('Do something');
//     return this.bar()
//   }
//   @Log('LOG')
//   bar() {
//     console.log('Do something');
//   }
// }
// // foo was decorated!
// console.log('MAKE INSTANCE')
// const p = new P();

// console.log('RUN foo() METHOD')
// p.foo(1,2);
// p.bar();
// // Do something
// console.log('END')