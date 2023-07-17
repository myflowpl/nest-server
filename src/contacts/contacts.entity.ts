export class Contact {
    id: number;
    name: string;
    email: string;
    message: string;

    constructor(data?: Partial<Contact>) {
        Object.assign(this, data);
    }
}
