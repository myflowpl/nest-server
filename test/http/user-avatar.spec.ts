import { INestApplication } from '@nestjs/common';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import request from 'supertest';
import { UserStatus } from '../../src/generated/prisma/client.js';
import { AuthService } from '../../src/auth/auth.service.js';
import { createTestApp } from '../support/app.js';

const createdAt = new Date('2026-01-01T10:00:00Z');
const admin = { id: 1, email: 'admin@example.com', createdAt, status: UserStatus.ACTIVE, profile: { displayName: 'Administrator', avatarId: null }, roles: [{ role: { name: 'admin' } }] };
const ala = { id: 2, email: 'ala@example.com', createdAt, status: UserStatus.ACTIVE, profile: { displayName: 'Ala', avatarId: null }, roles: [{ role: { name: 'user' } }] };
const ola = { id: 3, email: 'ola@example.com', createdAt, status: UserStatus.ACTIVE, profile: { displayName: 'Ola', avatarId: null }, roles: [{ role: { name: 'user' } }] };

// najmniejsze "obrazy": liczą się tylko pierwsze bajty (magic bytes)
const png = Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), Buffer.alloc(32)]);
const jpeg = Buffer.concat([Buffer.from('ffd8ffe0', 'hex'), Buffer.alloc(32)]);
const webp = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP'), Buffer.alloc(32)]);

describe('avatar użytkownika', () => {
  let app: INestApplication;
  let uploadDir: string;

  const tokenFor = (id: number) => app.get(AuthService).signToken(id);
  const prisma = { user: { findUnique: vi.fn() }, profile: { findUnique: vi.fn(), update: vi.fn() } };

  // wysyła plik jako użytkownik o danym id
  const upload = async (asId: number, targetId: number, file: Buffer, contentType = 'image/png') =>
    request(app.getHttpServer())
      .post(`/users/${targetId}/avatar`)
      .set('Authorization', `Bearer ${await tokenFor(asId)}`)
      .attach('file', file, { filename: 'moje zdjęcie.png', contentType });

  beforeAll(async () => {
    uploadDir = await mkdtemp(join(tmpdir(), 'avatars-'));
    process.env.UPLOAD_DIR = join(uploadDir, 'uploads'); // katalog nie istnieje, aplikacja ma go utworzyć
    app = await createTestApp(prisma);
  });

  afterAll(async () => {
    await app.close();
    await rm(uploadDir, { recursive: true, force: true });
    delete process.env.UPLOAD_DIR;
  });

  beforeEach(async () => {
    vi.resetAllMocks();
    await rm(process.env.UPLOAD_DIR!, { recursive: true, force: true });
    prisma.profile.findUnique.mockResolvedValue({ id: 20 });
    prisma.profile.update.mockResolvedValue({ ...ala, profile: { displayName: 'Ala', avatarId: 7 } });
  });

  const savedFiles = () => readdir(process.env.UPLOAD_DIR!).catch(() => [] as string[]);

  describe('POST /users/:id/avatar', () => {
    it('bez tokenu zwraca 401', async () => {
      await request(app.getHttpServer()).post('/users/2/avatar').attach('file', png, 'a.png').expect(401);
    });

    it('użytkownik wgrywa avatar sobie: plik na dysku pod nową nazwą, rekord zdjęcia i avatar profilu', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);

      const response = await upload(2, 2, png).expect(201);

      const files = await savedFiles();
      expect(files).toHaveLength(1);
      expect(files[0]).toMatch(/^[0-9a-f-]{36}\.png$/); // nazwa wygenerowana, nie od klienta
      expect(prisma.profile.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 20 },
          data: { avatar: { create: { userId: 2, fileName: files[0], originalName: 'moje zdjęcie.png', mimeType: 'image/png', size: png.length } } },
        }),
      );
      expect(response.body).toMatchObject({ id: 2, avatarUrl: '/users/2/avatar' });
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('rozpoznaje JPEG i WebP po zawartości', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);

      await upload(2, 2, jpeg, 'application/octet-stream').expect(201);
      await upload(2, 2, webp, 'application/octet-stream').expect(201);

      expect((await savedFiles()).map((name) => name.split('.')[1]).sort()).toEqual(['jpg', 'webp']);
    });

    it('administrator wgrywa avatar innemu, a rekord zdjęcia należy do admina', async () => {
      prisma.user.findUnique.mockResolvedValue(admin);

      await upload(1, 3, png).expect(201);

      expect(prisma.profile.findUnique).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 3 } }));
      expect(prisma.profile.update.mock.calls[0][0].data.avatar.create).toMatchObject({ userId: 1 });
    });

    it('zwykły użytkownik innemu zwraca 403 i nic nie zapisuje', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);

      await upload(2, 3, png).expect(403);

      expect(await savedFiles()).toEqual([]);
      expect(prisma.profile.update).not.toHaveBeenCalled();
    });

    it('plik tekstowy podpisany jako image/png zwraca 400 i nic nie zapisuje', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);

      const response = await upload(2, 2, Buffer.from('to nie jest obraz'), 'image/png').expect(400);

      expect(response.body.message).toMatch(/JPEG, PNG lub WebP/);
      expect(await savedFiles()).toEqual([]);
    });

    it('plik większy niż 4 MB zwraca 413', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);

      await upload(2, 2, Buffer.concat([png, Buffer.alloc(4 * 1024 * 1024)])).expect(413);

      expect(await savedFiles()).toEqual([]);
    });

    it('plik równy 4 MB jest przyjęty', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);

      await upload(2, 2, Buffer.concat([png, Buffer.alloc(4 * 1024 * 1024 - png.length)])).expect(201);
    });

    it('brak pliku zwraca 400', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);

      await request(app.getHttpServer())
        .post('/users/2/avatar')
        .set('Authorization', `Bearer ${await tokenFor(2)}`)
        .expect(400);
    });

    it('użytkownik bez profilu (lub nieistniejący) zwraca 404 i nic nie zapisuje', async () => {
      prisma.user.findUnique.mockResolvedValue(admin);
      prisma.profile.findUnique.mockResolvedValue(null);

      const response = await upload(1, 99, png).expect(404);

      expect(response.body.message).toMatch(/profil/i);
      expect(await savedFiles()).toEqual([]);
    });

    it('gdy zapis w bazie się nie uda, plik nie zostaje na dysku', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);
      prisma.profile.update.mockRejectedValue(new Error('baza padła'));

      await upload(2, 2, png).expect(500);

      expect(await savedFiles()).toEqual([]);
    });
  });

  describe('GET /users/:id/avatar', () => {
    it('bez tokenu zwraca 401', async () => {
      await request(app.getHttpServer()).get('/users/2/avatar').expect(401);
    });

    it('zwraca bajty ostatnio wgranego avatara z właściwym Content-Type', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);
      await upload(2, 2, png).expect(201);
      const [fileName] = await savedFiles();
      prisma.profile.findUnique.mockResolvedValue({ avatar: { fileName, mimeType: 'image/png' } });

      const response = await request(app.getHttpServer())
        .get('/users/2/avatar')
        .set('Authorization', `Bearer ${await tokenFor(3)}`) // czytać może każdy zalogowany
        .expect(200);

      expect(response.headers['content-type']).toBe('image/png');
      expect(Buffer.compare(response.body, png)).toBe(0);
    });

    it('bez avatara zwraca 404', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);
      prisma.profile.findUnique.mockResolvedValue({ avatar: null });

      await request(app.getHttpServer())
        .get('/users/2/avatar')
        .set('Authorization', `Bearer ${await tokenFor(2)}`)
        .expect(404);
    });

    it('dla nieistniejącego użytkownika zwraca 404', async () => {
      prisma.user.findUnique.mockResolvedValue(ala);
      prisma.profile.findUnique.mockResolvedValue(null);

      await request(app.getHttpServer())
        .get('/users/99/avatar')
        .set('Authorization', `Bearer ${await tokenFor(2)}`)
        .expect(404);
    });
  });
});
