import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RequestPayload, RoleNames, User } from '../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if(!token) {
      throw new UnauthorizedException('JWT token required')
    }

    // validate token & create request payload
    request.payload = {
      user: User.create({
        id: 1,
        name: 'Piotr',
        roles: [{id: 1, name: RoleNames.ROOT}]
      })
    };

    if(!request.payload) {
      throw new UnauthorizedException('JWT token expired')
    }

    return true;
  }

  extractToken(req: Request): string {

    const token = req.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }
}
