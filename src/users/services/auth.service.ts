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


    const payload: TokenPayload = await this.jwtService.verifyAsync(token);

    const user = await this.usersService.findOne(payload.sub);

    return user ? { user } : null;
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(email: string, password: string): Promise<User | null> {

    const [ user ] = await this.usersService.findBy({ email });

    if(!user) {
      return null;
    }

    const isValid = await this.validatePassword(password, user.password);

    return isValid ? user : null;
  }
}
