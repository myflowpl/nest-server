import { Injectable } from '@nestjs/common';
import { RequestPayload, RoleNames, TokenPayload, User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
    ) {}

    async encodeUserToken(user: User): Promise<string> {

        const payload: TokenPayload = { sub: user.id };

        return this.jwtService.signAsync(payload);
    }

    async decodeUserToken(token: string): Promise<RequestPayload | null> {

        const payload: TokenPayload | null = await this.jwtService.verifyAsync(token).catch(() => null)

        if(!payload) {
            return null;
        }

        const user = await this.usersService.findOneBy({ id: payload.sub });

        return user ? { user, token } : null;
    }

    async encodePassword(password: string) {
        return bcrypt.hash(password, 10)
    }

    async validatePassword(password: string, hash: string) {
        return bcrypt.compare(password, hash)
    }
}
