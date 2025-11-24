import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, MinLength } from 'class-validator'

export class CreateContactDto {

    @ApiProperty({ example: 'Piotr' })
    @MinLength(3)
    name: string;

    @ApiProperty({  example: 'piotr at myflowpl' })
    @IsEmail()
    email: string;

    @ApiProperty({  example: 'test value of message'  })
    message?: string;

    constructor(data?: Partial<CreateContactDto>) {
        Object.assign(this, data);
    }
}

export class GetContactsDto {

    @IsNumber()
    pageIndex?: number = 0;
    
    @IsNumber()
    pageSize?: number = 2;

    constructor(data?: Partial<GetContactsDto>) {
        Object.assign(this, data);
    }
}

export class HttpExceptionDto {
    message: string;
    error: string;
    statusCode: number;
}