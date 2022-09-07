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
  users: User[]
}

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @ManyToMany(type => Role, role => role.users, { eager: true })
  @JoinTable()
  roles: Role[];
}

export class TokenPayload {
  sub: number;
}

export class RequestPayload {
  user: User
}
