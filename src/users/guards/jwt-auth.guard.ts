import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token
    const token = this.extractToken(request);

    if(!token) {
      return false;
    }

    // extract user from token
    request.payload = await this.authService.decodeUserToken(token);

    // if user valid return true
    return !!request.payload;
  }

  extractToken(req: Request): string {

    const token = req.headers.authorization;

    return token ? token.replace('Bearer ', '') : '';
  }

}
