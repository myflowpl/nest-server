import { SetMetadata } from '@nestjs/common';
import { RoleNames } from '../entities/user.entity';

export const ROLES_KEY = 'roles';

export const Roles = (...args: RoleNames[]) => SetMetadata(ROLES_KEY, args);
