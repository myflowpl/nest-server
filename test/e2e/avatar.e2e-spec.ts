import { INestApplication } from '@nestjs/common';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { PrismaService } from '../../src/prisma/index.js';
import { createDbApp, login, uniqueEmail } from '../support/db-app.js';

const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(32)]);
const jpeg = Buffer.concat([Buffer.from('ffd8ffe0', 'hex'), Buffer.alloc(32)]);

describe('Avatar użytkownika (prawdziwa baza)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let uploadDir: string;

  beforeAll(async () => {
    uploadDir = await mkdtemp(join(tmpdir(), 'avatars-e2e-'));
    process.env.UPLOAD_DIR = uploadDir;
    app = await createDbApp();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    // zdjęcia i profile znikają razem z użytkownikami (kaskada)
    await prisma.user.deleteMany({ where: { email: { startsWith: 'e2e-' } } });
    await app.close();
    await rm(uploadDir, { recursive: true, force: true });
    delete process.env.UPLOAD_DIR;
  });

  it('każdy upload to nowy rekord i plik, a profil wskazuje ostatnie zdjęcie', async () => {
    const email = uniqueEmail('avatar');
    const { body: created } = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'secret1', displayName: 'Avatar' })
      .expect(201);
    const token = await login(app, email, 'secret1');
    const send = (file: Buffer, name: string) =>
      request(app.getHttpServer()).post(`/users/${created.id}/avatar`).set('Authorization', `Bearer ${token}`).attach('file', file, name);

    await send(png, 'a.png').expect(201);
    const second = await send(jpeg, 'b.jpg').expect(201);

    expect(second.body.avatarUrl).toBe(`/users/${created.id}/avatar`);
    expect(await prisma.photo.count({ where: { userId: created.id } })).toBe(2);
    expect(await readdir(uploadDir)).toHaveLength(2); // stary plik zostaje

    const response = await request(app.getHttpServer())
      .get(`/users/${created.id}/avatar`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.headers['content-type']).toBe('image/jpeg');
    expect(Buffer.compare(response.body, jpeg)).toBe(0);
  });

  it('administrator wgrywa avatar innemu: zdjęcie należy do admina, avatar do właściciela konta', async () => {
    const email = uniqueEmail('avatar-admin');
    const { body: created } = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email, password: 'secret1', displayName: 'Cudzy' })
      .expect(201);
    const adminToken = await login(app, 'admin@example.com', 'admin123');

    await request(app.getHttpServer())
      .post(`/users/${created.id}/avatar`)
      .set('Authorization', `Bearer ${adminToken}`)
      .attach('file', png, 'a.png')
      .expect(201);

    const profile = await prisma.profile.findUniqueOrThrow({ where: { userId: created.id }, include: { avatar: true } });
    const admin = await prisma.user.findUniqueOrThrow({ where: { email: 'admin@example.com' } });
    expect(profile.avatar?.userId).toBe(admin.id);
    await prisma.photo.deleteMany({ where: { id: profile.avatarId! } }); // zdjęcie admina nie znika kaskadą
  });
});
