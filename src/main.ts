import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from './config';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

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

// console.log('DECORATORY :)')


// function Log(label) {
//   return (target, key, descriptor) => {

//     console.log(`LOG ${label}: ${key} was decorated!`, label, target, key);
 
//     const orgFn = descriptor.value;
 
//     descriptor.value = function(...args) {
//       console.log(` ${key} function logic replaced`)
 
//       const data = orgFn.call(this, ...args)
 
//       console.log(` ${key} function logic wrapped after`, data)
 
//       return data;
//     }
//   };
// }
 
// class P {
//   @Log("Warn")
//   @Log("debug")
//   foo() { 
//     console.log('FOO ORGINAL FUNCTION')
//     return 'hej hej'
//    }
 
//   @Log("warning")
//   bar() {  }
// }
// // foo was decorated!
 
// const p = new P();
// p.foo();
// // Do something