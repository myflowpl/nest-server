import { Exclude, Transform } from "class-transformer";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';

export enum RoleNames {
  ADMIN = 'admin',
  ROOT = 'root',
}

@Entity()
export class Role {

  constructor(data: Partial<Role> = {}) {
    Object.assign(this, data);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: RoleNames;

  @ManyToMany(type => User)
  users: User[];
}

@Entity()
export class User {

  constructor(data: Partial<User> = {}) {
    Object.assign(this, data);
  }

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

  @ManyToMany(type => Role, role => role.users, { eager: true })
  @JoinTable()
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
