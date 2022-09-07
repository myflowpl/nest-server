import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { SimplePayload } from './contacts.dto';

@Injectable()
export class SimpleGuard implements CanActivate {

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = await this.extractToken(request);

    if(!token) {
      return false;
    }

    request.payload = await this.decodeUserToken(token);

    return !!request.payload;
  }

  async extractToken(request: Request): Promise<string> {

    const token = request.headers['authorization'];

    return token ? token.replace('Bearer ', '') : '';
  }

  async decodeUserToken(token: string): Promise<SimplePayload> {
    return {
      user: {id: 1, name: 'Piotr'}
    }
  }
}
