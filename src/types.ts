import 'express';
import { RequestPayload } from './users/entities/user.entity.js';

declare module 'express' {
    export interface Request {
        payload?: RequestPayload | undefined | null;
    }
}


export const TEST_INJEDTION = 'TEST INJECTION';