import { applyDecorators, UseGuards } from '@nestjs/common';
import { ExceptionResponse, RoleNames } from '../entities/user.entity.js';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard.js';
import { Roles } from './roles.decorator.js';

export const ApiAuth = (...roles: RoleNames[]) => applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    Roles(roles),
    ApiResponse({status: 401, type: ExceptionResponse, description: 'JWT token required'}),
    ApiResponse({status: 403, type: ExceptionResponse, description: 'Extra roles required'}),
);
