import 'express';
import type { RequestPayload } from '../auth/auth.types.js';

declare module 'express' {
  export interface Request {
    payload?: RequestPayload | null;
  }
}
