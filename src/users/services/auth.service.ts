import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestPayload, TokenPayload, User } from '../entities/user.entity';
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

  async decodeUserToken(token: string): Promise<RequestPayload> {

    const tokenPayload: TokenPayload = await this.jwtService.verifyAsync(token);

    const user = await this.usersService.findOne(tokenPayload.sub);

    return user ? { user } : null;
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(email: string, password: string): Promise<User | null> {

    const [user] = await this.usersService.findBy({ email });

    return user && await this.validatePassword(password, user.password) ? user : null;
  }

}
