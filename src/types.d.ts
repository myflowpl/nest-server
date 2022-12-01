import 'express';
import { RequestPayload } from './users/entities/user.entity/user.entity';

declare module 'express' {
  export interface Request {
    payload?: RequestPayload | null;
  }
}

// interface User {
//   name: string;
// }
// interface User {
//   email: string;
// }

// let u: User;
