import { Injectable, NotImplementedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto, RegisterDto } from './auth.dto.js';
import { RequestPayload, TokenPayload } from './auth.types.js';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  /** Rejestracja. TODO: implementacja w lekcji D2 (zapis do bazy). */
  register(_data: RegisterDto): Promise<unknown> {
    throw new NotImplementedException('Rejestrację zaimplementujesz w lekcji D2');
  }

  /** Logowanie. TODO: implementacja w lekcji D2 (odczyt z bazy). */
  login(_data: LoginDto): Promise<unknown> {
    throw new NotImplementedException('Logowanie zaimplementujesz w lekcji D2');
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

  /**
   * Zamienia token na użytkownika z bazy danych.
   * TODO: implementacja w lekcji D2 (potrzebuje bazy danych).
   */
  async authenticate(_token: string): Promise<RequestPayload | null> {
    return null;
  }
}
