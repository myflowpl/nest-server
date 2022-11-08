import { Exclude, Transform } from "class-transformer";

export enum RoleNames {
  ADMIN = 'admin',
  ROOT = 'root',
}

export class Role {
  id: number;
  name: RoleNames;
}

export class User {
  id: number;
  name: string;
  email: string;

  @Exclude()
  // @Transform((prop) => 'HIDDEN PASS', {toPlainOnly: true})
  // @Transform((prop) => 'SHOW PASS', {toClassOnly: true})
  password: string;

  roles: Role[];

  static create(data: Partial<User>): User {
    return Object.assign(new User(), data);
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
