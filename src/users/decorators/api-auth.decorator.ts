import { applyDecorators, UseGuards } from '@nestjs/common';
import { ExceptionResponse, RoleNames } from '../entities/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from './roles.decorator';

export const ApiAuth = (...roles: RoleNames[]) => applyDecorators(
    UseGuards(JwtAuthGuard),
    Roles(...roles),
    ApiBearerAuth(),
    ApiResponse({status: 401, description: 'Uanthorized: JWT token required', type: ExceptionResponse}),
    ApiResponse({status: 403, description: 'Forbidden: Extra roles required', type: ExceptionResponse}),
);
