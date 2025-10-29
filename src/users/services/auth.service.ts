import { Injectable } from '@nestjs/common';
import { RequestPayload, RoleNames, TokenPayload, User } from '../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    protected jwtSerice: JwtService,
    protected usersService: UsersService,
  ) {}

  async encodeUserToken(user: User) {

    const payload: TokenPayload = { sub: user.id };

    return this.jwtSerice.signAsync(payload);
  }

  async decodeUserToken(token: string): Promise<RequestPayload | null> {

    // decode jwt token
    const payload: TokenPayload = await this.jwtSerice.verifyAsync(token).catch(() => null)

    // validate
    if(!payload) {
        return null;
    }

    // find user in DB
    const user = await this.usersService.findOneBy({ id: payload.sub });

    // return request payload
    return token ? { user, token } : null;
  }


  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

}
