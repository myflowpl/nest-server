import { Injectable } from '@nestjs/common';
// import { JwtService } from '@nestjs/jwt';
import { RequestPayload } from '../entities/user.entity';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  // constructor(private usersService: UsersService, private jwtService: JwtService) {}

  // async validateUser(email: string, password: string): Promise<User | null> {}

  // async encodePassword(password: string): Promise<string> {}

  // async validatePassword(password: string, hash: string): Promise<boolean> {}

  // async encodeUserToken(user: User): Promise<string> {}

  // async decodeUserToken(token: string): Promise<RequestPayload> {}
}
