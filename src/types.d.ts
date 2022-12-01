import 'express';
import { RequestPayload } from './users/entities/user.entity/user.entity';
import { PAYLOAD_KEY } from './users/guards/jwt-auth.guard';

declare module 'express' {
  export interface Request {
    [PAYLOAD_KEY]?: RequestPayload | null;
  }
}

// interface User {
//   name: string;
// }
// interface User {
//   email: string;
// }

// let u: User;
