import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { RoleNames, User } from '../entities/user.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request: Request = context.switchToHttp().getRequest();

    const token = this.extractToken(request);

    if(!token) {
      return false;
    }

    // TODO dekodowanie tokenu
    request.payload = {
      user: User.create({
        id: 1,
        name: 'Piotr',
        roles: [{id: 1, name: RoleNames.ADMIN}]
      })
    }

    if(!request.payload) {
      return false;
    }

    return true;
  }

  extractToken(request: Request): string {

    const token = request.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }
}
