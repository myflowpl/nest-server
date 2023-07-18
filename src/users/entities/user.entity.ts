import { Exclude } from "class-transformer";

export enum RoleNames {
    ADMIN = 'admin',
    ROOT = 'root',
}

export class Role {
    id: number;
    name: RoleNames;

    constructor(data?: Role) {
        Object.assign(this, data);
    }
}

export class User {
    id: number;
    name: string;
    email: string;

    @Exclude()
    password: string;
    
    roles: Role[];

    constructor(data?: Partial<User>) {
        Object.assign(this, data);
    }
}

export class TokenPayload {
    sub: number;
}

export class RequestPayload {
    user: User;
    token: string;
}

export class ExceptionResponse {
    message: string;
    error: string;
    statusCode: number;
}