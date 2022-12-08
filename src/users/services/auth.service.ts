import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestPayload, Role, RoleNames, TokenPayload, User } from '../entities/user.entity/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async decodeUserToken(token: string): Promise<RequestPayload | null> {

    // verify & decode jwt token so you have the TokenPayload
    const payload: TokenPayload = await this.jwtService.verifyAsync(token).catch(() => null);

    // check if payload is valid
    if(!payload) {
      return null;
    }

    // get user from database
    let user = await this.usersService.findOneBy({ id: payload.sub });
    
    // return RequestPayload
    return user ? { user } : null;
  }

  async encodeUserToken(user: User): Promise<string> {

    const payload: TokenPayload = { sub: user.id, name: user.name };

    return this.jwtService.signAsync(payload);
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
