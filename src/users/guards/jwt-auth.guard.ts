import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleNames } from '../entities/user.entity/user.entity';
import { AuthService } from '../services/auth.service';

export const PAYLOAD_KEY = Symbol('payload')

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token from request headers
    const token = this.extractToken(request);

    if(!token) {
      throw new UnauthorizedException(`The JWT token not found in authorization header`);
    }

    // validate token & extract user from the token
    request[PAYLOAD_KEY] = await this.authService.decodeUserToken(token);

    // forbidden if no valid user
    if(!request[PAYLOAD_KEY]) {
      throw new UnauthorizedException(`The JWT token expired or malformed`);
    }

    // get required roles from roles metadata decorator
    const requiredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler()) || [];

    // if empty, allow access
    if(!requiredRoles || !requiredRoles.length) {
      return true;
    }

    // get user roles
    const userRoles: RoleNames[] = request[PAYLOAD_KEY].user.roles?.map(role => role.name) || [];

    // check if user has required role
    if(!requiredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException(`This endpoint requires one of [${requiredRoles.join(', ')}] roles`);
    }

    return true;
  }

  extractToken(req: Request): string {

    const token = req.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }
}
