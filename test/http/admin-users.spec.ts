import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserStatus } from '../../src/generated/prisma/client.js';
import { AuthService } from '../../src/auth/auth.service.js';
import { createTestApp } from '../support/app.js';

// rekordy w takim kształcie, w jakim zwraca je Prisma (userSelect)
const createdAt = new Date('2026-01-01T10:00:00Z');
const admin = { id: 1, email: 'admin@example.com', createdAt, status: UserStatus.ACTIVE, profile: { displayName: 'Administrator' }, roles: [{ role: { name: 'admin' } }] };
const user = { id: 2, email: 'ala@example.com', createdAt, status: UserStatus.ACTIVE, profile: { displayName: 'Ala' }, roles: [{ role: { name: 'user' } }] };

describe('GET /admin/users', () => {
  let app: INestApplication;

  // prawdziwy token JWT dla użytkownika o danym id (podpisany sekretem z konfiguracji testów)
  const tokenFor = (id: number) => app.get(AuthService).signToken(id);

  // atrapa Prismy: guard pyta o użytkownika z tokenu, lista o rekordy i ich liczbę
  const prisma = { user: { findUnique: vi.fn(), findMany: vi.fn(), count: vi.fn() }, $transaction: vi.fn() };

  beforeAll(async () => {
    app = await createTestApp(prisma);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(() => {
    vi.resetAllMocks();
    prisma.$transaction.mockImplementation((operations) => Promise.all(operations));
  });

  it('bez tokenu zwraca 401', async () => {
    await request(app.getHttpServer()).get('/admin/users').expect(401);
  });

  it('zwykłemu użytkownikowi zwraca 403', async () => {
    prisma.user.findUnique.mockResolvedValue(user);

    await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${await tokenFor(2)}`)
      .expect(403);
  });

  it('administratorowi zwraca stronę użytkowników', async () => {
    prisma.user.findUnique.mockResolvedValue(admin);
    prisma.user.findMany.mockResolvedValue([admin, user]);
    prisma.user.count.mockResolvedValue(2);

    const response = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${await tokenFor(1)}`)
      .expect(200);

    expect(response.body.total).toBe(2);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0]).toMatchObject({ email: 'admin@example.com', roles: ['admin'] });
  });

  it('odrzuca zbyt duży pageSize (400) bez pytania bazy', async () => {
    prisma.user.findUnique.mockResolvedValue(admin);

    await request(app.getHttpServer())
      .get('/admin/users?pageSize=500')
      .set('Authorization', `Bearer ${await tokenFor(1)}`)
      .expect(400);

    expect(prisma.user.findMany).not.toHaveBeenCalled();
  });
});
