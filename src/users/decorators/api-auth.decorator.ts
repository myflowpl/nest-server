import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { RoleNames, ExceptionResponse } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from './roles.decorator';

export const ApiAuth = (...roles: RoleNames[]) => applyDecorators(
  UseGuards(JwtAuthGuard),
  ApiBearerAuth(),
  Roles(...roles),
  ApiUnauthorizedResponse({type: ExceptionResponse}),
  ApiForbiddenResponse({type: ExceptionResponse}),
);
