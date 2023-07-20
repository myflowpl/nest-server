import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { WsAuthPayload } from './chat.entity';

@Injectable()
export class ChatGuard implements CanActivate {

  canActivate(context: ExecutionContext): boolean {


    const socket: Socket = context.switchToWs().getClient();

    const auth = socket.handshake.auth as WsAuthPayload; 

    if(auth.user) {
      return true;
    }
    
    if(!auth.token) {
      return false;
    }

    auth.user = { username: auth.token };

    return true;
  }
}
