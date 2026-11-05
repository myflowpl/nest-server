import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestPayload, TokenPayload } from './auth.types.js';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /** Tworzy token JWT dla użytkownika o podanym id. */
  signToken(userId: number): Promise<string> {
    const payload: TokenPayload = { sub: userId };
    return this.jwtService.signAsync(payload);
  }

  /** Sprawdza podpis tokenu. Zwraca payload albo null, gdy token jest błędny lub wygasł. */
  verifyToken(token: string): Promise<TokenPayload | null> {
    return this.jwtService.verifyAsync<TokenPayload>(token).catch(() => null);
  }

  /**
   * Zamienia token na użytkownika z bazy danych.
   * TODO: implementacja w lekcji D2 (potrzebuje bazy danych).
   */
  async authenticate(_token: string): Promise<RequestPayload | null> {
    return null;
  }
}
