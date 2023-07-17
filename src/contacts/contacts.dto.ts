import { IsEmail, IsEnum, IsNumber, MinLength } from "class-validator";

export class CreateContactDto {
    @MinLength(3)
    name: string;

    @IsEmail()
    email: string;

    message: string;
}

export class UpdateContactDto {
    name: string;
    message: string;
}

export enum SortDir {
    ASC = 'asc',
    DESC = 'desc',
}

export class GetContactsDto {
    @IsNumber()
    pageIndex?: number = 0;
    
    @IsNumber()
    pageSize?: number = 2;

    sortBy?: string = 'email';

    @IsEnum(SortDir)
    sortDir?: SortDir = SortDir.ASC;
}
