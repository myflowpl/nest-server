import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
  ){}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token from the request
    const token = this.extractToken(request);

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

    return true;
  }

  extractToken(request: Request): string {
    const token = request.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }

}
