import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();

    const token = await this.extractToken(request);

    if(!token) {
      return false;
    }

    request.payload = await this.authService.decodeUserToken(token);

    if(!request.payload) {
      return false;
    }

    // odczytac wymagane role z dekoratora @Roles()
    const requiredRoles = this.reflector.get(ROLES_KEY, context.getHandler());

    // jesli zadne role sa nie wymangae to return true
    if(!requiredRoles || !requiredRoles.length) {
      return true;
    }

    // odczytac role z enitity usera
    const userRoles = request?.payload?.user?.roles?.map(role => role.name) || [];

    // porownac czy use ma wymagane role
    return requiredRoles.some((role) => userRoles.includes(role))
  }

  async extractToken(request: Request): Promise<string> {

    const token = request.headers['authorization'];

    return token ? token.replace('Bearer ', '') : '';
  }

}
