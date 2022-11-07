import { Injectable } from '@nestjs/common';
import { RequestPayload, User } from '../entities/user.entity';

@Injectable()
export class AuthService {

  async decodeUserToken(token: string): Promise<RequestPayload | null> {


    const payload = {
      user: User.create({
        id: 1,
        name: 'piotr',
        email: 'piotr@myflow.pl'
      })
    }

    return token ? payload : null;
  }
}
