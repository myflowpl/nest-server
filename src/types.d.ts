import 'express';
import { RequestPayload } from './users/entities/user.entity/user.entity';

declare module 'express' {
  export interface Request {
    payload?: RequestPayload | null;
  }
}