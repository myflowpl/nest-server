import { applyDecorators, UseGuards } from '@nestjs/common';
import { ExceptionResponse, RoleNames } from '../entities/user.entity/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from './roles.decorator';

export const ApiAuth = (...roles: RoleNames[]) => applyDecorators(
    ApiBearerAuth(),
    UseGuards(JwtAuthGuard),
    Roles(...roles),
    ApiResponse({status: 401, type: ExceptionResponse, description: 'Unauthenticated: JWT token required'}),
    ApiResponse({status: 403, type: ExceptionResponse, description: 'Forbidden: extra roles required'}),
);
