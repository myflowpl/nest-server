import { Exclude } from "class-transformer";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export enum RoleNames {
    ADMIN = 'admin',
    ROOT = 'root',
}

@Entity()
export class Role {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: RoleNames;

    constructor(data?: Role) {
        Object.assign(this, data);
    }
}

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;

    @Exclude()
    @Column()
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