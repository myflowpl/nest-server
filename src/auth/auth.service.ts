import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/index.js';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { RequestPayload, RoleNames, TokenPayload } from './auth.types.js';
import { toUserView, userSelect } from '../users/user.view.js';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prisma: PrismaService,
  ) { }

  /** Rejestracja: zapisuje użytkownika z zahashowanym hasłem. Duplikat emaila -> P2002 -> 409. */
  async register(data: RegisterDto) {

    const passwordHash = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        profile: { create: { displayName: data.displayName } },
        roles: { create: { role: { connect: { name: RoleNames.USER } } } },
      },
      select: userSelect,
    });
    return toUserView(user);

  }

  /** Logowanie: sprawdza hasło i zwraca token JWT razem z użytkownikiem (bez hasła). */
  async login(data: LoginDto) {

    // hasło jest domyślnie wycięte z odpowiedzi (patrz PrismaService), tu prosimy o nie wprost
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: { ...userSelect, passwordHash: true }
    });

    const valid = user && (await bcrypt.compare(data.password, user.passwordHash));

    if (!user || !valid) {
      throw new UnauthorizedException('Credentials Invalid');
    }


    return { token: await this.signToken(user.id), user: toUserView(user) };
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

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub }, select: userSelect });

    if (!user) {
      return null;
    }
    // role pojawią się w lekcji D3
    const view = toUserView(user);
    return { user: { id: view.id, email: view.email, roles: view.roles } };
  }
}
