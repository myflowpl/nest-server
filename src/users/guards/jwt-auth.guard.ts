import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { RoleNames } from '../entities/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token
    const token = this.extractToken(request);

    if(!token) {
      throw new UnauthorizedException(`JWT token required`);
    }

    // extract user from token
    request.payload = await this.authService.decodeUserToken(token);

    // forbidden if no payload
    if(!request.payload) {
      throw new UnauthorizedException(`JWT token expired`);
    }

    // get required roles
    const requredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler())

    // if empty allow
    if(!requredRoles || !requredRoles.length) {
      return true;
    }

    // get user roles
    const userRoles: RoleNames[] = request.payload.user.roles?.map(role => role.name) || []

    // check if user has required roles
    if(!requredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException(`This endpoint requires one of ${requredRoles.join(', ')} roles`);
    }

    return true;
  }

  extractToken(req: Request): string {

    const token = req.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }

}
