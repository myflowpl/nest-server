import { Exclude } from "class-transformer";
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToMany(type => User)
  users: User[];
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
  
  @ManyToMany(type => Role, role => role.users, {eager: true})
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
