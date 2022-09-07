import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = await this.extractToken(request);

    if(!token) {
      return false;
    }

    request.payload = await this.authService.decodeUserToken(token);

    return !!request.payload;
  }

  async extractToken(request: Request): Promise<string> {

    const token = request.headers['authorization'];

    return token ? token.replace('Bearer ', '') : '';
  }

}
