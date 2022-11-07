import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
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