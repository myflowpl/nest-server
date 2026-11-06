import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';
import { setupApp } from '../../src/app.setup.js';

/** Aplikacja z prawdziwą Prismą i bazą testową (adres z konfiguracji vitest.config.e2e.ts). */
export async function createDbApp(): Promise<INestApplication> {
  const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
  const app = setupApp(module.createNestApplication());
  await app.init();
  return app;
}

/** Loguje użytkownika przez HTTP i zwraca token JWT. */
export async function login(app: INestApplication, email: string, password: string): Promise<string> {
  const response = await request(app.getHttpServer()).post('/auth/login').send({ email, password });
  return response.body.token;
}

/** Unikalny email, żeby testy nie wchodziły sobie w drogę (i można je potem posprzątać po prefiksie `e2e-`). */
export const uniqueEmail = (name: string) => `e2e-${name}-${Date.now()}-${Math.floor(Math.random() * 1000)}@example.com`;
