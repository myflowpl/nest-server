import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { Prisma } from '../../src/generated/prisma/client.js';
import { createTestApp } from '../support/app.js';

describe('POST /auth/register', () => {
  let app: INestApplication;

  const prisma = { user: { create: vi.fn() } };
  const body = { email: 'ala@example.com', password: 'secret1', displayName: 'Ala' };

  beforeAll(async () => {
    app = await createTestApp(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('odrzuca błędny email (400) bez pytania bazy', async () => {
    await request(app.getHttpServer()).post('/auth/register').send({ ...body, email: 'to-nie-email' }).expect(400);

    expect(prisma.user.create).not.toHaveBeenCalled();
  });

  it('zajęty email kończy się odpowiedzią 409 (filtr błędów Prismy)', async () => {
    // baza zgłasza naruszenie unikalności - tak jak przy prawdziwym duplikacie
    prisma.user.create.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('Unique constraint failed', { code: 'P2002', clientVersion: 'test' }),
    );

    const response = await request(app.getHttpServer()).post('/auth/register').send(body).expect(409);

    expect(response.body).toMatchObject({ statusCode: 409, error: 'P2002' });
  });
});
