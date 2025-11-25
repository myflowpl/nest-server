import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from '../services/auth.service';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
  ){}

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    let token = '';
    let request: Request;

    if(context.getType() === 'http') {
      // get request from context
      request = context.switchToHttp().getRequest();
  
      // extract token from request
      token = request.headers.authorization?.replace('Bearer ', '') || '';

      // validate token if exists
      if(!token) {
        throw new UnauthorizedException(`JWT required in Authorization header`)
      }

      // validate & decode token to TokenPayload
      request.payload = await this.authService.decodeUserToken(token);

      console.log('request payload', request.payload)

      return true;

    } else if(context.getType() === 'ws') {
      // TODO
      const data = context.switchToWs().getData();
      throw new InternalServerErrorException(`not suppported type of context "${context.getType()}"`);
      
    } else if(context.getType() === 'rpc') {
      // TODO implement other conext rpc 
      throw new InternalServerErrorException(`not suppported type of context "${context.getType()}"`);
    }
    
    throw new InternalServerErrorException(`not suppported type of context "${context.getType()}"`);
    
  }
}
