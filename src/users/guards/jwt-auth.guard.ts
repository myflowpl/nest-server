import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // get request

    // extract token from the request

    // if no token, reject, return false or throw unauthorized error

    // decode the token and create request payload

    // if no request payload, throw unauthorized error

    return true;
  }

  extractToken(request: Request): string {
    const token = request.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }

}
