import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RoleNames, User } from '../entities/user.entity.js';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator.js';
import { AuthService } from '../services/auth.service.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    // handle HTTP
    if(context.getType() === 'http') {

      const request: Request = context.switchToHttp().getRequest();

      const token = this.extractToken(request);

      if(!token) {
        throw new UnauthorizedException('JWT Token is required');
      }

      // extract user from token
      request.payload = await this.authService.decodeUserToken(token);

      // forbidden if no payload
      if(!request.payload) {
        throw new UnauthorizedException('JWT Token invalid');
      }

      // get required roles
      const roles = this.reflector.get(Roles, context.getHandler());

      // if empty allow access
      if(!roles) {
        return true;
      }

      const requiredRoles: RoleNames[] = Array.isArray(roles) ? roles : [roles];

      // if empty allow access
      if(!requiredRoles.length) {
        return true;
      }
      // get urser roles
      const userRoles: RoleNames[] = request.payload.user.roles?.map(r => r.name) || [];

      // check if user hasd required roles
      if(!requiredRoles.some(role => userRoles.includes(role))) {
        throw new ForbiddenException(`THis endpoin requires one of ${requiredRoles.join(', ')} roles`)
      }

      // jest ok
      return true;

    // HANDLE WebSockets
    } else if  (context.getType() === 'ws') {
      // TODO WS guard
    }

    return false;
  } 

  extractToken(req: Request): string {

    return req.headers.authorization?.replace('Bearer ', '') || '';
  }
}
