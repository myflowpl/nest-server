import 'dotenv/config';
import { Injectable } from '@nestjs/common';

/** Zwraca wartość zmiennej środowiskowej albo przerywa start z czytelnym komunikatem. */
function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Brak zmiennej ${name} w pliku .env (skopiuj .env.example do .env)`);
  }
  return value;
}

@Injectable()
export class ConfigService {
  readonly DEBUG = process.env.DEBUG === 'true';
  readonly PORT = parseInt(process.env.PORT ?? '3000', 10);
  readonly DATABASE_URL = required('DATABASE_URL');
  readonly JWT_SECRET = required('JWT_SECRET');
}
