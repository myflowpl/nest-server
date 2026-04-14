import { Injectable } from '@nestjs/common';
import { RequestPayload, TokenPayload, User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { StoreService } from '../../store/store.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private store: StoreService,
    ) {

    }

    async decodeUserToken(token: string): Promise<RequestPayload | null> {

        // verify token with JwtService
        const payload: TokenPayload = await this.jwtService.verifyAsync(token).catch(() => null)

        // check if valid token payload
        if(!payload) {
            return null;
        }

        // get user from storage
        const user = await this.store.findOneBy(User, { id: payload.sub });

        // return request payload
        return token ? { user, token } : null;
    }

    async encodeUserToken(user: User): Promise<string> {

        // create token payload
        const payload: TokenPayload = { sub: user.id };

        // sign & create token
        const token = await this.jwtService.signAsync(payload);

        // return 
        return token;
    }

    async encodePassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async validatePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }

}
