import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { AuthUser } from '../auth.types.js';

/** Parametr metody kontrolera: zalogowany użytkownik (z JwtAuthGuard). */
export const Auth = createParamDecorator((data: unknown, context: ExecutionContext): AuthUser | undefined => {
  const request: Request = context.switchToHttp().getRequest();
  return request.payload?.user;
});
