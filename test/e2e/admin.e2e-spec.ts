import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/index.js';
import { createDbApp, login, uniqueEmail } from '../support/db-app.js';

describe('Panel administratora (prawdziwa baza)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let adminToken: string;

  beforeAll(async () => {
    app = await createDbApp();
    prisma = app.get(PrismaService);
    adminToken = await login(app, 'admin@example.com', 'admin123');
  });

  afterAll(async () => {
    // sprzątamy konta założone przez testy (profile i role znikają kaskadowo)
    await prisma.user.deleteMany({ where: { email: { startsWith: 'e2e-' } } });
    await app.close();
  });

  it('administrator z seeda widzi listę użytkowników', async () => {
    const response = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    // admin + 50 użytkowników z seeda
    expect(response.body.total).toBeGreaterThanOrEqual(51);
    expect(response.body.items).toHaveLength(10);
  });

  it('ten sam email drugi raz kończy się 409 (unikalność pilnuje baza)', async () => {
    const body = { email: uniqueEmail('duplikat'), password: 'secret1', displayName: 'Duplikat' };

    await request(app.getHttpServer()).post('/auth/register').send(body).expect(201);
    await request(app.getHttpServer()).post('/auth/register').send(body).expect(409);
  });

  it('zablokowany użytkownik traci dostęp od razu (logowanie 403, stary token 401)', async () => {
    const email = uniqueEmail('blokada');
    const { body: created } = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'secret1', displayName: 'Blokada' })
      .expect(201);
    const token = await login(app, email, 'secret1');

    await request(app.getHttpServer())
      .patch(`/admin/users/${created.id}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'BLOCKED' })
      .expect(200);

    await request(app.getHttpServer()).post('/auth/login').send({ email, password: 'secret1' }).expect(403);
    await request(app.getHttpServer()).get('/auth/me').set('Authorization', `Bearer ${token}`).expect(401);
  });

  it('blokada zbiorcza pomija administratora i zostawia ślad w dzienniku', async () => {
    const { body: created } = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: uniqueEmail('zbiorcza'), password: 'secret1', displayName: 'Zbiorcza' })
      .expect(201);
    const adminId = (await request(app.getHttpServer()).get('/auth/me').set('Authorization', `Bearer ${adminToken}`)).body.id;

    const response = await request(app.getHttpServer())
      .post('/admin/users/bulk-block')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ ids: [created.id, adminId] })
      .expect(201);

    expect(response.body).toEqual({ blocked: 1 });
    // sprawdzamy bazę wprost: jest wpis w dzienniku z listą id
    const log = await prisma.auditLog.findFirst({ where: { action: 'user.bulk-block' }, orderBy: { id: 'desc' } });
    expect(log?.payload).toEqual({ ids: [created.id, adminId] });
  });
});
