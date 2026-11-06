import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserStatus } from '../../src/generated/prisma/client.js';
import { AuthService } from '../../src/auth/auth.service.js';
import { createTestApp } from '../support/app.js';

const createdAt = new Date('2026-01-01T10:00:00Z');
const admin = { id: 1, email: 'admin@example.com', createdAt, status: UserStatus.ACTIVE, profile: { displayName: 'Administrator' }, roles: [{ role: { name: 'admin' } }] };
const user = { id: 2, email: 'ala@example.com', createdAt, status: UserStatus.ACTIVE, profile: { displayName: 'Ala' }, roles: [{ role: { name: 'user' } }] };

describe('GET /admin/users/export', () => {
  let app: INestApplication;

  const tokenFor = (id: number) => app.get(AuthService).signToken(id);
  const prisma = { user: { findUnique: vi.fn(), findMany: vi.fn(), count: vi.fn() }, $transaction: vi.fn() };

  beforeAll(async () => {
    app = await createTestApp(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('bez tokenu zwraca 401', async () => {
    await request(app.getHttpServer()).get('/admin/users/export').expect(401);
  });

  it('zwykłemu użytkownikowi zwraca 403', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    await request(app.getHttpServer())
      .get('/admin/users/export')
      .set('Authorization', `Bearer ${await tokenFor(2)}`)
      .expect(403);
  });

  it('administratorowi zwraca CSV bez stronicowania i bez hasła', async () => {
    prisma.user.findUnique.mockResolvedValue(admin);
    prisma.user.findMany.mockResolvedValue([admin, user]);

    const response = await request(app.getHttpServer())
      .get('/admin/users/export')
      .set('Authorization', `Bearer ${await tokenFor(1)}`)
      .expect(200);

    expect(response.headers['content-type']).toMatch(/^text\/csv/);
    expect(response.text.split('\n')).toEqual([
      'id,email,displayName,status,createdAt',
      '1,admin@example.com,Administrator,ACTIVE,2026-01-01T10:00:00.000Z',
      '2,ala@example.com,Ala,ACTIVE,2026-01-01T10:00:00.000Z',
    ]);
    expect(response.text).not.toContain('passwordHash');

    const args = prisma.user.findMany.mock.calls[0][0];
    expect(args).not.toHaveProperty('take');
    expect(args).not.toHaveProperty('skip');
    expect(args.select).not.toHaveProperty('passwordHash');
  });

  it('filtr status trafia do zapytania', async () => {
    prisma.user.findUnique.mockResolvedValue(admin);
    prisma.user.findMany.mockResolvedValue([]);

    await request(app.getHttpServer())
      .get('/admin/users/export?status=BLOCKED')
      .set('Authorization', `Bearer ${await tokenFor(1)}`)
      .expect(200);

    expect(prisma.user.findMany.mock.calls[0][0].where).toEqual({ status: 'BLOCKED' });
  });

  it('nieznany status zwraca 400', async () => {
    prisma.user.findUnique.mockResolvedValue(admin);

    await request(app.getHttpServer())
      .get('/admin/users/export?status=FOO')
      .set('Authorization', `Bearer ${await tokenFor(1)}`)
      .expect(400);
  });
});
