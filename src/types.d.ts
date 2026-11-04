import 'express';
import { RequestPayload } from './users/entities/user.entity.ts';

declare module 'express' {
    export interface Request {
        payload?: RequestPayload | undefined | null;
    }
}