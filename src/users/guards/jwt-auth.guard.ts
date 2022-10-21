import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RequestPayload, RoleNames, User } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}
  
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if(!token) {
      throw new UnauthorizedException('JWT token required')
    }

    // validate token & create request payload
    request.payload = await this.authService.decodeUserToken(token);

    if(!request.payload) {
      throw new UnauthorizedException('JWT token expired')
    }

    // get required roles from the controller @Roles() decorator
    const requiredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler());

    // if no required roles allow access
    if(!requiredRoles || !requiredRoles.length) {
      return true;
    }

    // get current user roles
    const userRoles: RoleNames[] = request.payload.user?.roles?.map(role => role.name) || [];

    // test if required roles are assigned to user roles
    return requiredRoles.some(role => userRoles.includes(role));
  }

  extractToken(req: Request): string {

    const token = req.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }
}
