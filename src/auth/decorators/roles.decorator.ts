import { SetMetadata } from '@nestjs/common';
import { RoleNames } from '../auth.types.js';

export const ROLES_KEY = Symbol('roles');

/** Wymaga jednej z podanych ról. Działa razem z JwtAuthGuard. */
export const Roles = (...roles: RoleNames[]) => SetMetadata(ROLES_KEY, roles);
