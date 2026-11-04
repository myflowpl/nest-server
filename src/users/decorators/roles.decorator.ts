import { Reflector } from '@nestjs/core';
import { RoleNames } from '../entities/user.entity.js';

export const Roles = Reflector.createDecorator<RoleNames[]>();
