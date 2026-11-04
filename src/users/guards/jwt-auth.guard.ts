import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity.js';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    // handle HTTP
    if(context.getType() === 'http') {

      const request: Request = context.switchToHttp().getRequest();

      const token = this.extractToken(request);

      if(!token) {
        throw new UnauthorizedException('JWT Token is required');
      }

      // extract user from token
      request.payload = token ? {
        user: new User({name: 'Piotr'})
      } : null;

      // forbidden if no payload
      if(!request.payload) {
        throw new UnauthorizedException('JWT Token invalid');
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
