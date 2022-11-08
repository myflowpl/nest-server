import { Exclude, Transform } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  // @Transform((prop) => 'HIDDEN PASS', {toPlainOnly: true})
  // @Transform((prop) => 'SHOW PASS', {toClassOnly: true})
  @Column()
  password: string;

  roles: Role[];

  static create(data: Partial<User>): User {
    return Object.assign(new User(), data);
  }
}

export class TokenPayload {
  sub: number;
}

export class RequestPayload {
  user: User
}

export class ExceptionResponse {
  statusCode: number;
  message: string;
  error: string;
}
