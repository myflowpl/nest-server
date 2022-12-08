
export class User {
  id: number;
  name: string;
  email: string;
  password: string;

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