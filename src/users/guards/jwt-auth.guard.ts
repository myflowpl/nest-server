import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { RoleNames } from '../entities/user.entity/user.entity';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token from the request
    const token = request.headers.authorization?.replace('Bearer ', '')

    // if no token, reject, return false or throw unauthorized error
    if(!token) {
      throw new UnauthorizedException(`The JWT token was not found in authorization header but is required`)
    }

    // decode the token and create request payload
    request.payload = await this.authService.decodeUserToken(token);

    // if no request payload, throw unauthorized error
    if(!request.payload) {
      throw new UnauthorizedException(`The JWT token expired or malformed`)
    }

    // get required roles from @Roles() decorator metadata
    const requiredRoles: RoleNames[] = this.reflector.get('roles', context.getHandler()) || [];

    // if empty, return true
    if(!requiredRoles || !requiredRoles.length) {
      return true;
    }

    // get user roles
    const userRoles = request.payload?.user?.roles?.map(role => role.name) || [];

    // check if user has required role
    if(!requiredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException(`This endpoint requires one of [${requiredRoles.join(', ')}] role`)
    }

    return true;
  }

}
