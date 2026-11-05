import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { ExceptionResponse, RoleNames } from '../auth.types.js';
import { JwtAuthGuard } from '../jwt-auth.guard.js';
import { Roles } from './roles.decorator.js';

/** Zabezpiecza endpoint: guard JWT + (opcjonalnie) role + opis w Swaggerze. */
export const ApiAuth = (...roles: RoleNames[]) =>
  applyDecorators(
    UseGuards(JwtAuthGuard),
    Roles(...roles),
    ApiBearerAuth(),
    ApiResponse({ status: 401, type: ExceptionResponse, description: 'Brak lub błędny token JWT' }),
    ApiResponse({ status: 403, type: ExceptionResponse, description: 'Brak wymaganej roli' }),
  );
