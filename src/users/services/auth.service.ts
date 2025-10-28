import { Injectable } from '@nestjs/common';
import { RequestPayload, RoleNames, User } from '../entities/user.entity/user.entity';

@Injectable()
export class AuthService {

    async decodeUserToken(token: string): Promise<RequestPayload | null> {

        // decode jwt toke

        // validate
        if(!token) {
            return null;
        }

        // find user in DB
        const user = new User({
          id: 1,
          name: 'Piotr',
          email: 'piotr@myflow.pl',
          password: 'hashed-password',
          roles: [{ id: 1, name: RoleNames.ROOT }],
        });

        // return request payload


    return token ? { user } : null;
  }
}
