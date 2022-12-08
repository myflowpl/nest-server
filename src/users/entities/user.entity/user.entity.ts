
export enum RoleNames {
  ADMIN = 'admin',
  ROOT = 'root',
}

export class Role {
  id: number;
  name: RoleNames;

  constructor(data?: Partial<Role>) {
    Object.assign(this, data);
  }
}

export class User {
  id: number;
  name: string;
  email: string;
  password: string;

  roles: Role[];

  constructor(data?: Partial<User>) {
    Object.assign(this, data);
  }
}

export class TokenPayload {
  sub: number;
  name: string;
}

export class RequestPayload {
  user: User;
}

export class ExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}