import { ApiProperty } from "@nestjs/swagger";

export class Contact {

    id: number;
    
    @ApiProperty({description: 'Podaj swoje imie', example: 'Piotr'})
    name: string;
    
    @ApiProperty({description: 'email', example: 'piotr@myflow.pl'})
    email: string;
    
    @ApiProperty({description: 'wiadomosc', example: 'Potrzebuje wsparcia'})
    message: string;

    constructor(data?: Partial<Contact>){
        Object.assign(this, data);
    }
}
