import { ApiProperty } from "@nestjs/swagger";

export class Contact {

    id: number;
    name: string;
    email: string;

    @ApiProperty({description: 'Opis proprerty message jest opcjonalny', required: false, example: 'test value of message'})
    message: string;

    constructor(data?: Partial<Contact>) {
        Object.assign(this, data);
    }
}
