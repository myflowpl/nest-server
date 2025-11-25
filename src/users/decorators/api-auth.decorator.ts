import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { RoleNames, ExceptionResponse } from '../entities/user.entity';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { Roles } from './roles.decorator';

export const ApiAuth = (...roles: RoleNames[]) => applyDecorators(
    UseGuards(JwtAuthGuard),
    ApiBearerAuth(),
    Roles(...roles),
    ApiResponse({status: 401, type: ExceptionResponse, description: 'Unauthorized: JWT teoken required'}),
    ApiResponse({status: 403, type: ExceptionResponse, description: 'Forbidden: Extra roles required'}),
);
