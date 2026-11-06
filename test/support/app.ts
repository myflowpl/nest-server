import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../../src/app.module.js';
import { setupApp } from '../../src/app.setup.js';
import { PrismaService } from '../../src/prisma/index.js';

/** Aplikacja NestJS do testów HTTP: prawdziwe kontrolery, pipe'y, guardy i filtry, ale Prisma podmieniona na atrapę. */
export async function createTestApp(prisma: object): Promise<INestApplication> {
  const module = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();

  const app = setupApp(module.createNestApplication());
  await app.init();
  return app;
}
