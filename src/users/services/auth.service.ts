import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthLoginResponse } from '../dto';
import { RequestPayload, TokenPayload, User } from '../entities';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async encodePassword(password: string) {
    const saltOrROunds = 10;
    return bcrypt.hash(password, saltOrROunds);
  }

  async findByCredentials(email: string, password: string): Promise<User | null> {

    const [user] = await this.usersService.findBy({email});

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return new User(result);
    }
    return null;
  }

  async encodeUserToken(user: User): Promise<string> {

    const payload: TokenPayload = { username: user.email, sub: user.id };

    return this.jwtService.sign(payload);
  }


  async decodeUserToken(token: string): Promise<RequestPayload | null> {

    if(!token) {
      return null;
    }
    
    const payload: TokenPayload = this.jwtService.verify(token);

    const [user] = await this.usersService.findBy({id: payload.sub});

    return { user } || null;
  }
}
