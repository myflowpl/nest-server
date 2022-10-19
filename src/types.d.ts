// import { RequestPayload } from '../entities';
import 'express';

declare module 'express' {
  export interface Request {
    //  payload?: RequestPayload;
  }
}