import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { WorkerModule } from './worker/worker.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(WorkerModule, {
    transport: Transport.TCP,
    options: {
      port: 3001,
    },
  });
  await app.listen();
}
bootstrap();
