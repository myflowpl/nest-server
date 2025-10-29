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

  async canActivate( context: ExecutionContext): Promise<boolean> {

    // get request instace
    const request: Request = context.switchToHttp().getRequest();

    // extract token form req
    const token = request.headers.authorization?.replace('Bearer ', '');

    // validate if no token
    if(!token) {
      throw new UnauthorizedException(`JWT required in Authorization header`);
    }

    // decode token to request payload
    request.payload = await this.authService.decodeUserToken(token);

    // validate payload existence
    if(!request.payload) {
      throw new UnauthorizedException(`JWT expired or malfolded`);
    }

    // get required roles form controller method metadata
    const requiredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler()) || [];

    // if no required roles return true
    if(requiredRoles.length === 0) {
      return true;
    }

    // get user roles form request.payload.user
    const userRoles: RoleNames[] = request.payload.user.roles?.map(role => role.name) || [];

    // check if user has required roles, if not throw forbidden exception
    if(!requiredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException(`This endpoint requires one of ${requiredRoles.join(', ')} roles`)
    }

    // if ok, return true and grant access
    return true;
  }
}
