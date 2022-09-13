import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { ExceptionResponse, RoleNames } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from './roles.decorator';

export const ApiAuth = (...roles: RoleNames[]) => applyDecorators(
  UseGuards(JwtAuthGuard),
  ApiBearerAuth(),
  Roles(...roles),
  ApiUnauthorizedResponse({ description: 'Wymagany JWT token', type: ExceptionResponse}),
  ApiForbiddenResponse({ description: 'Wymagany JWT token', type: ExceptionResponse}),
);
