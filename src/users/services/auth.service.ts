import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestPayload, TokenPayload, User } from '../entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const [user] = await this.usersService.findBy({ email });

    if (!user) {
      return null;
    }

    const isValid = await this.validatePassword(password, user.password);

    if (!isValid) {
      return null;
    }

    return user;
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async encodeUserToken(user: User): Promise<string> {
    const payload: TokenPayload = { username: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }

  async decodeUserToken(token: string): Promise<RequestPayload> {
    const payload: TokenPayload = this.jwtService.verify(token);

    const user = await this.usersService.findOne(payload.sub);

    return user ? { user } : null;
  }
}
