import { ApiProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "../users/entities/user.entity";

@Entity()
export class Photo {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    filename: string;
    
    @Column({nullable: true})
    description?: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(type => User, {nullable: false, eager: true})
    user: User;

    constructor(data?: Partial<Photo>) {
        Object.assign(this, data);
    }
}

export class PhotosUploadDto {

    @ApiProperty({ type: 'string', format: 'binary'})
    file: any;

    description?: string;
}