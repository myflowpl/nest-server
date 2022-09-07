import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import { expressApp } from './express/server';
import {
  SwaggerModule,
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerCustomOptions,
} from '@nestjs/swagger';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule, 
    new ExpressAdapter(expressApp)
  );

  // SWAGGER SETUP
  const swaggerConfig = new DocumentBuilder()
  .setTitle('Mój Projekt w Nest')
  .setDescription('Przykładowy projekt w Node.js i TypeScript')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const options: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
  };

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);

  const customOptions: SwaggerCustomOptions = {
  swaggerOptions: { persistAuthorization: true },
  };

  SwaggerModule.setup('docs', app, document, customOptions);
  // END OF SWAGGER SETUP


  await app.listen(3000);
}
bootstrap();

// function Log(label) {
//   return function log(target, key, descriptor) {
//     console.log(`${label} Log was initialized on ${key} `);
//     const orginalFn = descriptor.value;
//     descriptor.value = function(...args) {
//       console.log('RUN METADATA', target[key]._method)
//       console.log(label +' FOO WAS FIRED !!!')
//       const data = orginalFn.apply(this, args)
//       console.log(label +' FOO LOGIC DONE !!!')

//       return data;
//     }
//     target[key]._method = 'GET';

//     console.dir(target)
//     console.log('ARGS', target, key, descriptor)
//   }
// }

// function post(target, key, descriptor) {
//   target[key]._method = 'POST';
// }
// function cls(...args) {
//   console.log('CLS', args)
// }
// @cls
// class P {
//   static staticName = 'static test'
//   @post
//   @Log('DEBUG')
//   foo(): string {
//     console.log('FOO BUISNESS WORK DONE');
//     return 'work result FOO'
//   }
//   @Log('WARNING')
//   boo(): string {
//     console.log('BOO BUISNESS WORK DONE');
//     return 'work result from BOO'
//   }
// }
// const p = new P();
// console.log('RUN', p.foo())
// console.log('RUN', p.boo())
