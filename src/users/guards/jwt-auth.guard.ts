import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService
  ) {}

  async canActivate( context: ExecutionContext ): Promise<boolean> {


    if(context.getType() === 'ws') {
      // TODO implement
    } else if (context.getType() === 'rpc') {
      // todo 
    }

    // http
    // get request
    const request: Request = context.switchToHttp().getRequest();

    // extract token
    const token: string = request.headers.authorization?.replace('Bearer ', '') || '';

    // validate if token exists
    if(!token) {
      throw new UnauthorizedException(`JWT token is required`)
    }

    // validate & decode token to payload
    request.payload = await this.authService.decodeUserToken(token);

    // validate if payload exists
    if(!request.payload) {
      throw new UnauthorizedException(`JWT token invalid`)
    }

    return true;
  }
}
