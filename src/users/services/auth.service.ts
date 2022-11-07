import { Injectable } from '@nestjs/common';
import { RequestPayload, RoleNames, User } from '../entities/user.entity';

@Injectable()
export class AuthService {

  async decodeUserToken(token: string): Promise<RequestPayload | null> {


    const payload = {
      user: User.create({
        id: 1,
        name: 'piotr',
        email: 'piotr@myflow.pl',
        roles: [{id: 1, name: RoleNames.ROOT}]
      })
    }

    return token ? payload : null;
  }
}
