import { Contact } from "./contacts.entity";

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {
  pageIndex?: number = 1;
  pageSize?: number = 2;
  sortBy?: string = 'email';
  sortDir?: SortDir = SortDir.ASC;
}

export class CreateContactDto {
  name: string;
  email: string;
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
