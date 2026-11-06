import 'express';
import 'multer'; // typy Express.Multer.File (uploady plików)
import type { RequestPayload } from '../auth/auth.types.js';

declare module 'express' {
  export interface Request {
    payload?: RequestPayload | null;
  }
}
