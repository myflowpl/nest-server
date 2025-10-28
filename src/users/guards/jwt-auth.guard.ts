import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
  ) {}

  async canActivate( context: ExecutionContext): Promise<boolean> {

    // get request instace
    const request: Request = context.switchToHttp().getRequest();

    // extract token form req
    const token = request.headers.authorization?.replace('Bearer ', '');

    // validate if no token
    if(!token) {
      throw new UnauthorizedException(`JWT required in Authorization header`);
    }

    // decode token to request payload
    request.payload = await this.authService.decodeUserToken(token);

    // validate payload
    return !!request.payload;
  }
}
