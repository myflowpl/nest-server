import { ApiProperty } from '@nestjs/swagger';
import { Contact } from './contacts.entity.js';
import { IsEmail, IsString, MinLength } from 'class-validator';

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {

  @ApiProperty({example: 0})
  pageIndex?: number = 0;
  
  @ApiProperty({example: 2})
  pageSize?: number = 2;

  @ApiProperty({example: 'email'})
  sortBy?: string = 'email';

  @ApiProperty({example: SortDir.ASC, enum: SortDir})
  sortDir?: SortDir = SortDir.ASC;
}

export class CreateContactDto {
  
  @ApiProperty({description: 'Podaj swoje imie', example: 'Piotr'})
  @MinLength(3)
  name: string;
  
  @ApiProperty({description: 'email', example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;
  
  @ApiProperty({description: 'wiadomosc', example: 'Potrzebuje wsparcia'})
  message: string;
}

export class CreateContactResponse {
  contact: Contact;
}

export class UpdateContactDto {
  @MinLength(3)
  @IsString()
  name: string;
  @IsEmail()
  email: string;
  @IsString()
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
