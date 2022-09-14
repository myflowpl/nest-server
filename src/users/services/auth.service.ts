import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestPayload, TokenPayload, User } from '../entities/user.entity';
import { UsersService } from './users.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService, 
    private jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {

    const [user] = await this.usersService.findBy({ email });

    if(!user) {
      return null;
    }

    const isValid = await this.validatePassword(password, user.password);

    return isValid ? user : null;
  }

  async encodePassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async encodeUserToken(user: User): Promise<string> {
    
    const payload: TokenPayload = { sub: user.id }

    return this.jwtService.signAsync(payload);
  }

  async decodeUserToken(token: string): Promise<RequestPayload> {

    const payload: TokenPayload = await this.jwtService.verifyAsync(token);

    const user = await this.usersService.findOne(payload.sub);

    return user ? { user } : null;
  }
}
