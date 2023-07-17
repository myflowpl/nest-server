import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    // get request instance
    const request: Request = context.switchToHttp().getRequest();

    // extract token
    const token = request.headers.authorization?.replace('Bearer ', '');

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

    // ok, allow access
    return true;
  }
}
