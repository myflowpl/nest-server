import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { Reflector } from '@nestjs/core';
import { RoleNames } from '../entities/user.entity';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    // get request instance
    const request: Request = context.switchToHttp().getRequest();

    // extract token
    let token = request.headers.authorization?.replace('Bearer ', '');

    // try query params
    if(!token) {
      token = request.query.token as string;
    }

    // if no token, throw exception
    if(!token) {
      throw new UnauthorizedException(`JWT required in Authorization header`)
    }

    // validate & decode token to TokenPayload
    request.payload = await this.authService.decodeUserToken(token);

    // if no payload, throw exception
    if(!request.payload) {
      throw new UnauthorizedException(`JWT expired or malfolded`)
    }

    // get required roles from controller method
    const requredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler()) || [];

    // if no requred roles, allow access
    if(!requredRoles.length) {
      return true;
    }

    // get user roles
    const userRoles: RoleNames[] = request.payload.user.roles?.map(role => role.name) || [];

    // check if user has rqured roles
    if(!requredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException(`This endpoint requires one of ${requredRoles.join(', ')} roles`);
    }

    // ok, allow access
    return true;
  }
}
