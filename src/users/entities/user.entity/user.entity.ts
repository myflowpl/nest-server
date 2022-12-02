import { Exclude } from "class-transformer";

export enum RoleNames {
  ADMIN = 'admin',
  ROOT = 'root',
}

export class Role {
  id: number;
  name: RoleNames;

  constructor(data?: Partial<Role>) {
    return Object.assign(this, data);
  }
}

export class User {
  id: number;
  name: string;
  email: string;

  @Exclude()
  password: string;
  
  roles: Role[];

  constructor(data?: Partial<User>) {
    return Object.assign(this, data);
  }
}

export class TokenPayload {
  sub: number;
}

export class RequestPayload {
  user: User
}

export class ExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}
