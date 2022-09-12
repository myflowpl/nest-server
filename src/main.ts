import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

// function Log(label) {
//   return (target, key, descriptor) => {
//     console.log(`LOG ${label}: ${key} was decorated!`, label, target, key, descriptor);

//     const orgFn = descriptor.value;

//     descriptor.value = function(...args) {
//       console.log(` ${key} function logic replaced`)

//       const data = orgFn.call(this, ...args)

//       console.log(` ${key} function logic wrapped after`, data)

//       return data;
//     }
//   };
// }

// function controller(...args) {
//   console.log('CLASS DECORATOR', args)
// }

// @controller
// class P {
//   @Log('debug')
//   foo() {
//     console.log('foo() WORK IS RUNNING')
//     return 'test data'
//   }

//   @Log('wargning')
//   bar() {}
// }

// console.log('RUN THE APP')

// const p = new P()

// p.foo();