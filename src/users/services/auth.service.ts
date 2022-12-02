import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestPayload, RoleNames, TokenPayload, User } from '../entities/user.entity/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async decodeUserToken(token: string): Promise<RequestPayload | null> {

    // verify & decode jwt token
    const payload: TokenPayload = await this.jwtService.verifyAsync(token).catch(() => null)

    // check if present
    if(!payload) {
      return null;
    }

    // get user from database
    const user = await this.usersService.findOne(payload.sub);

    // create request payload
    return user ? { user } : null;
  }

  async encodeUserToken(user: User): Promise<string> {

    const payload: TokenPayload = { sub: user.id };

    return this.jwtService.signAsync(payload);
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }
  
  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

}
