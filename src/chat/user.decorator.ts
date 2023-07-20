import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Socket } from 'socket.io';

export const User = createParamDecorator((data: unknown, context: ExecutionContext) => {

    const socket: Socket = context.switchToWs().getClient();

    return socket.handshake.auth.user;
});
