import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/index.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { RequestPayload, TokenPayload } from './auth.types.js';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) {}

  /** Rejestracja: zapisuje użytkownika z zahashowanym hasłem. Duplikat emaila -> P2002 -> 409. */
  async register(data: RegisterDto) {
    const passwordHash = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({ data: { email: data.email, passwordHash } });
  }

  /** Logowanie: sprawdza hasło i zwraca token JWT razem z użytkownikiem (bez hasła). */
  async login(data: LoginDto) {
    // hasło jest domyślnie wycięte z odpowiedzi (patrz PrismaService), tu prosimy o nie wprost
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      omit: { passwordHash: false },
    });

    const valid = user && (await bcrypt.compare(data.password, user.passwordHash));
    if (!user || !valid) {
      throw new UnauthorizedException('Credentials Invalid');
    }

    // hash hasła zostaje tutaj - do odpowiedzi trafia tylko reszta pól
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return { token: await this.signToken(user.id), user: safeUser };
  }

  /** Tworzy token JWT dla użytkownika o podanym id. */
  signToken(userId: number): Promise<string> {
    const payload: TokenPayload = { sub: userId };
    return this.jwtService.signAsync(payload);
  }

  /** Sprawdza podpis tokenu. Zwraca payload albo null, gdy token jest błędny lub wygasł. */
  verifyToken(token: string): Promise<TokenPayload | null> {
    return this.jwtService.verifyAsync<TokenPayload>(token).catch(() => null);
  }

  /** Zamienia token na użytkownika z bazy. Null, gdy token jest błędny albo użytkownik nie istnieje. */
  async authenticate(token: string): Promise<RequestPayload | null> {
    const payload = await this.verifyToken(token);
    if (!payload) {
      return null;
    }
    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user) {
      return null;
    }
    // role pojawią się w lekcji D3
    return { user: { id: user.id, email: user.email, roles: [] } };
  }
}
