import { ApiProperty } from "@nestjs/swagger";

export class CreateContactDto {

    @ApiProperty({
        example: 'Piotr'
    })
    name: string;

    @ApiProperty({
        example: 'piotr at myflowpl'
    })
    email: string;

    @ApiProperty({
        example: 'test value of message'
    })
    message: string;

    constructor(data?: Partial<CreateContactDto>) {
        Object.assign(this, data);
    }
}
export class GetContactsDto {

    pageIndex: number;

    pageSize: number;

    constructor(data?: Partial<GetContactsDto>) {
        Object.assign(this, data);
    }
}

export class HttpExceptionDto {
    message: string;
    error: string;
    statusCode: number;
}