import { CanActivate, ExecutionContext, ForbiddenException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';
import { RoleNames } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ){}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    if(context.getType() === 'ws') {
      // TODO
      const data = context.switchToWs().getData();
      throw new InternalServerErrorException(`not suppported type of context "${context.getType()}"`);
      
    } else if(context.getType() === 'rpc') {
      // TODO implement other conext rpc 
      context.switchToRpc().getData();
      throw new InternalServerErrorException(`not suppported type of context "${context.getType()}"`);
    }


    // get request from context
    const request: Request = context.switchToHttp().getRequest();

    // extract token from request
    const token: string = request.headers.authorization?.replace('Bearer ', '') || '';

    // validate token if exists
    if(!token) {
      throw new UnauthorizedException(`JWT required in Authorization header`)
    }
    
    // validate & decode token to TokenPayload
    request.payload = await this.authService.decodeUserToken(token);
    
    if(!request.payload) {
      throw new UnauthorizedException(`JWT expired or malfolded`)
    }

    // get required roles form controller OR method
    const requiredRoles: RoleNames[] = this.reflector.get(ROLES_KEY, context.getHandler()) || [];

    // if required roles empty, return true
    if(!requiredRoles.length) {
      return true;
    }

    // get user roles
    const userRoles: RoleNames[] = request.payload.user.roles?.map(role => role.name) || [];

    // chec if user has required roles, if not throw error
    if(!requiredRoles.some(role => userRoles.includes(role))) {
      throw new ForbiddenException(`This endpoint requires one of "${requiredRoles.join(', ')}" roles`);
    }

    // it's ok, return true
    return true;
    
  }
}
