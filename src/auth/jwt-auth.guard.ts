import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { RoleNames } from './auth.types.js';
import { AuthService } from './auth.service.js';
import { ROLES_KEY } from './decorators/roles.decorator.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException('JWT token required');
    }

    // token -> użytkownik z bazy (null, gdy token błędny, użytkownik zablokowany lub usunięty)
    request.payload = await this.authService.authenticate(token);
    if (!request.payload) {
      throw new UnauthorizedException('JWT token invalid');
    }

    // wymagane role (z dekoratora @Roles na metodzie lub kontrolerze)
    const required = this.reflector.getAllAndOverride<RoleNames[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (required?.length) {
      const has = request.payload.user.roles.some((role) => required.includes(role));
      if (!has) {
        throw new ForbiddenException(`This endpoint requires one of roles: ${required.join(', ')}`);
      }
    }
    return true;
  }

  private extractToken(req: Request): string {
    const header = req.headers.authorization;
    return header ? header.replace('Bearer ', '') : '';
  }
}
