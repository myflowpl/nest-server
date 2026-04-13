import { Contact } from "./contacts.entity";
import { IsString, MinLength, IsEmail, IsOptional, IsNumber } from 'class-validator';

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {
  @IsNumber()
  pageIndex?: number = 1;

  @IsNumber()
  pageSize?: number = 2;

  
  sortBy?: string = 'email';

  sortDir?: SortDir = SortDir.ASC;
}

export class GetContactDto {
  id: number;
}

export class CreateContactDto {
  @IsString()
  @MinLength(3)
  name: string;
  
  @IsEmail()
  email: string;
  
  @IsString()
  @IsOptional()
  message: string;
}

export class CreateContactResponse {
  contact: Contact;
}

export class UpdateContactDto {
  name: string;
  email: string;
  message: string;
}

export class UpdateContactResponse {
  contact: Contact;
}

export class ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}
