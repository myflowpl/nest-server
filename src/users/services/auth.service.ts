import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestPayload, Role, RoleNames, TokenPayload, User } from '../entities/user.entity/user.entity';
import { UsersService } from './users.service';

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

  encodeUserToken() {
    
  }
}
