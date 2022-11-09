import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../users/entities/user.entity";

export class PhotoUploadDto {

  @ApiProperty({ type: 'string', format: 'binary'})
  file: any;

  description?: string;
}

@Entity()
export class Photo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  filename: string;

  @Column({nullable: true})
  description?: string;

  @ManyToOne(type => User, {eager: true, nullable: false})
  user: User;

  constructor(data: Partial<Photo>) {
    Object.assign(this, data);
  }
}