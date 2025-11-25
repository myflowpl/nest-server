import { Injectable } from '@nestjs/common';
import { RequestPayload, RoleNames, User } from '../entities/user.entity';

@Injectable()
export class AuthService {

    async decodeUserToken(token: string): Promise<RequestPayload | null> {

        // mock fake user
        const user = new User({
            id: 1,
            name: 'Piotr',
            roles: [{ id: 1, name: RoleNames.ROOT }]
        });

        return token ? { user } : null;
    }
}
