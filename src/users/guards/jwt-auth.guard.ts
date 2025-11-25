import { CanActivate, ExecutionContext, Injectable, InternalServerErrorException } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {

  async canActivate( context: ExecutionContext ): Promise<boolean> {

    let token = '';

    if(context.getType() === 'http') {
      // get request from context
      const request: Request = context.switchToHttp().getRequest();
  
      // extract token from request
      token = request.headers.authorization?.replace('Bearer ', '') || '';

    } else if(context.getType() === 'ws') {
      // TODO
      const data = context.switchToWs().getData();
      throw new InternalServerErrorException(`not suppported type of context "${context.getType()}"`);
      
    } else if(context.getType() === 'rpc') {
      // TODO implement other conext rpc 
      throw new InternalServerErrorException(`not suppported type of context "${context.getType()}"`);
    }

    // validate token if exists
    if(!token) {
      return false;
    }

    return true;
    
  }
}
