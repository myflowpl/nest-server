import { Exclude, Transform } from "class-transformer";
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

  @ManyToMany((type) => User)
  users: User[];

  constructor(data?: Partial<Role>) {
    return Object.assign(this, data);
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

  @Transform((v) => v.value?.map(r => r.name), {toPlainOnly: true})
  @ManyToMany((type) => Role, role => role.users, { eager: true })
  @JoinTable()
  roles: Role[];

  constructor(data?: Partial<User>) {
    return Object.assign(this, data);
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
  statusCode: number;
  message: string;
  error: string;
}
