import { ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/index.js';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let service: AuthService;

  // atrapa Prismy: tylko te metody, których używa AuthService
  const prisma = { user: { findUnique: vi.fn(), update: vi.fn(), create: vi.fn() } };

  // rekord taki, jaki zwróciłaby baza (z hashem hasła); niski koszt bcrypt = szybki test
  const userRecord = async (status: UserStatus = UserStatus.ACTIVE) => ({
    id: 1,
    email: 'ala@example.com',
    createdAt: new Date(),
    status,
    passwordHash: await bcrypt.hash('secret1', 4),
    profile: { displayName: 'Ala' },
    roles: [{ role: { name: 'user' } }],
  });

  beforeEach(async () => {
    vi.resetAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { signAsync: vi.fn().mockResolvedValue('test-token'), verifyAsync: vi.fn() } },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('login', () => {
    it('odrzuca nieznany email (401)', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.login({ email: 'nikt@example.com', password: 'secret1' })).rejects.toThrow(UnauthorizedException);
    });

    it('odrzuca błędne hasło (401) i nie zapisuje logowania', async () => {
      prisma.user.findUnique.mockResolvedValue(await userRecord());

      await expect(service.login({ email: 'ala@example.com', password: 'zle-haslo' })).rejects.toThrow(UnauthorizedException);
      expect(prisma.user.update).not.toHaveBeenCalled();
    });

    it('odrzuca zablokowanego użytkownika (403)', async () => {
      prisma.user.findUnique.mockResolvedValue(await userRecord(UserStatus.BLOCKED));

      await expect(service.login({ email: 'ala@example.com', password: 'secret1' })).rejects.toThrow(ForbiddenException);
    });

    it('zwraca token i użytkownika bez hasha, a logowanie zapisuje w lastLoginAt', async () => {
      prisma.user.findUnique.mockResolvedValue(await userRecord());

      const result = await service.login({ email: 'ala@example.com', password: 'secret1' });

      expect(result.token).toBe('test-token');
      expect(result.user).not.toHaveProperty('passwordHash');
      expect(prisma.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: { lastLoginAt: expect.any(Date) } });
    });
  });

    describe('register', () => {
    it('zapisuje hash hasła, a nie samo hasło', async () => {
      prisma.user.create.mockResolvedValue({
        id: 2,
        email: 'bob@example.com',
        createdAt: new Date(),
        status: UserStatus.ACTIVE,
        profile: { displayName: 'Bob' },
        roles: [{ role: { name: 'user' } }],
      });

      await service.register({ email: 'bob@example.com', password: 'secret1', displayName: 'Bob' });

      const { data } = prisma.user.create.mock.calls[0][0];
      expect(data.passwordHash).not.toBe('secret1');
      expect(await bcrypt.compare('secret1', data.passwordHash)).toBe(true);
    });
  });
});

