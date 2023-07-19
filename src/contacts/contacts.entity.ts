import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Contact {
    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column({unique: true})
    email: string;
    @Column()
    message: string;

    constructor(data?: Partial<Contact>) {
        Object.assign(this, data);
    }
}
