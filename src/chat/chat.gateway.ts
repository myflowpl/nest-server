import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from './user.decorator';
import { UseGuards } from '@nestjs/common';
import { ChatGuard } from './chat.guard';
import { WsAuthPayload, WsUser } from './chat.entity';

export interface Connection {
  user: WsUser;
  client: Socket;
}

export interface Message {
  user: WsUser;
  message: string;
}

export interface ClientMessage {
  message: string;
}

@WebSocketGateway({ namespace: '/chat'})
@UseGuards(ChatGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  server: Server;

  messages: Message[] = [];

  connections: Connection[] = [];

  get usernames() {
    return this.connections.map(c => c.user.username).filter(n => !!n);
  }

  handleConnection(client: Socket, @User() user: WsUser) {
    console.log('Connected');

    // const auth = client.handshake.auth as WsAuthPayload; 
    // auth.user = { username: auth.token };

  }

  handleDisconnect(@ConnectedSocket() client: Socket) {

    console.log('Disconnected');

    this.connections = this.connections.filter(c => c.client !== client);
  }

  @SubscribeMessage('client_login')
  login(@ConnectedSocket() client: Socket, @User() user: WsUser) {

    this.connections.push({ client, user });

    this.messages.forEach(message => client.emit('server_message', message));

    this.server.emit('server_users', this.usernames);
  }

  @SubscribeMessage('client_message')
  clientMessage(@MessageBody() data: ClientMessage, @User() user: WsUser) {

    const message: Message = {
      user, 
      message: data.message
    };

    this.messages.push(message);

    this.messages = this.messages.slice(-5);

    this.server.emit('server_message', message);
  }
}
