import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleNames, User } from '../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if(!token) {
      return false;
    }

    // TODO dekodowanie tokenu
    request.payload = {
      user: User.create({
        id: 1,
        name: 'Piotr',
        roles: [{id: 1, name: RoleNames.ADMIN}]
      })
    }

    if(!request.payload) {
      return false;
    }

    // pobrac role z dkoratora @Roles()
    const requiredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler()) || [];

    if(!requiredRoles.length) {
      return true;
    }

    // pobrac role usera
    const userRoles: RoleNames[] = request.payload.user?.roles?.map(role => role.name) || [];

    // zvalidowac wymanage role

    return requiredRoles.some(role => userRoles.includes(role));
  }

  extractToken(request: Request): string {

    const token = request.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }
}
