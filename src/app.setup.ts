import { INestApplication, ValidationPipe } from '@nestjs/common';

/** Wspólna konfiguracja aplikacji: używa jej main.ts i testy, więc test działa na tej samej konfiguracji co serwer. */
export function setupApp<T extends INestApplication>(app: T): T {
  // walidacja DTO w całej aplikacji
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  return app;
}
