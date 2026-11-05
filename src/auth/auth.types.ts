export enum RoleNames {
  ADMIN = 'admin',
  USER = 'user',
}

/** Użytkownik zapisany w requeście po uwierzytelnieniu (bez hasła). */
export class AuthUser {
  id: number;
  email: string;
  roles: RoleNames[];
}

/** To, co trzymamy w tokenie JWT. */
export class TokenPayload {
  sub: number;
}

/** To, co guard zapisuje w `request.payload`. */
export class RequestPayload {
  user: AuthUser;
}

export class ExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}
