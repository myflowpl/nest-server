import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

export const PAYLOAD_KEY = Symbol('payload')

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token from request headers
    const token = this.extractToken(request);

    if(!token) {
      throw new UnauthorizedException(`The JWT token not found in authorization header`);
    }

    // validate token & extract user from the token
    request[PAYLOAD_KEY] = await this.authService.decodeUserToken(token);

    // forbidden if no valid user
    if(!request[PAYLOAD_KEY]) {
      throw new UnauthorizedException(`The JWT token expired or malformed`);
    }
    
    return true;
  }

  extractToken(req: Request): string {

    const token = req.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }
}
