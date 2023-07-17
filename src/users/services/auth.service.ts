import { Injectable } from '@nestjs/common';
import { RequestPayload, RoleNames, User } from '../entities/user.entity';

@Injectable()
export class AuthService {

    async decodeUserToken(token: string): Promise<RequestPayload | null> {

        // TODO decode token & create request payload
        const user = new User({
            id: 1,
            name: 'Piotr',
            email: 'piotr@myflow.pl',
            password: 'hashed-password',
            roles: [ { id: 1, name: RoleNames.ADMIN } ]
        });

        return token ? { user, token } : null;
    }
}
