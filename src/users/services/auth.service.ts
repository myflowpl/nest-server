import { Injectable } from '@nestjs/common';
import { User, TokenPayload, RequestPayload } from '../entities/user.entity.js';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service.js';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    async encodeUserToken(user: User): Promise<string> {

        const payload: TokenPayload = { sub: user.id }

        return this.jwtService.signAsync(payload);
    }

    async decodeUserToken(token: string): Promise<RequestPayload> {


        const payload: TokenPayload | null = await this.jwtService.verifyAsync(token).catch(() => null);

        if (!payload) {
            return null;
        }

        const user = await this.usersService.findOne(payload.sub);

        return user ? { user, accessToken: token } : null;
    }

    async encodePassword(password: string): Promise<string> {
        return bcrypt.hash(password, 10);
    }

    async validatePassword(password: string, hash: string): Promise<boolean> {
        return bcrypt.compare(password, hash);
    }


}
