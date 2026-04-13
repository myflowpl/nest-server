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
  ) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {

    if (context.getType() === 'ws') {
      // TODO implement
    } else if (context.getType() === 'rpc') {
      // todo 
    }

    // http
    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token
    const token: string = request.headers.authorization?.replace('Bearer ', '') || '';

    // validate if token exists
    if (!token) {
      throw new UnauthorizedException(`JWT token is required`)
    }

    // validate & decode token to payload
    request.payload = await this.authService.decodeUserToken(token);

    // validate if payload exists
    if (!request.payload) {
      throw new UnauthorizedException(`JWT token invalid`)
    }

    // get requred roles from controller or method
    const requiredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler()) || [];

    // if required roles empty, return true
    if(!requiredRoles.length) {
      return true;
    }

    // get user roles
    const userRoles: RoleNames[] = request.payload.user.roles?.map(role => role.name) || [];

    // check if rules has required roles, if not throw error
    if(!requiredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException('not enought role')
    }

    // its ok
    return true;
  }
}
