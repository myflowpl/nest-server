import { Injectable } from '@nestjs/common';
import { RequestPayload, User } from '../entities/user.entity/user.entity';

@Injectable()
export class AuthService {

  async decodeUserToken(token: string): Promise<RequestPayload | null> {

    // verify & decode jwt token so you have the TokenPayload

    // check if payload is valid

    // get user from database
    let user: User;
    // mock the user -> TODO read the user from database
    if(token) {
      user = new User({
        id: 1,
        name: 'Piotr',
        email: 'piotr@myflow.pl',
        password: 'has of my password'
      });
    }

    // return RequestPayload
    return user ? { user } : null;
  }
}
