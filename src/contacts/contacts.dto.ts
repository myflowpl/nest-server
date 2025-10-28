import { ApiProperty } from "@nestjs/swagger";
import { Contact } from "./contacts.entity";
import { IsString, MinLength, IsEmail, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Transform } from "class-transformer";

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

export class CreateContactDto {
  
  @IsString()
  @MinLength(3)
  @ApiProperty({example: 'Piotr'})
  name: string;
  
  @IsEmail()
  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @IsString()
  @IsOptional()
  message: string;

  @ApiProperty({example: '2022-03-20'})
  @Transform(({value}) => new Date(value), {toClassOnly: true})
  @Transform(({value}) => value.toISOString(), {toPlainOnly: true})
  date?: Date
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
