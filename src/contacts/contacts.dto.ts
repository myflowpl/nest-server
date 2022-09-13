import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, MinLength, IsOptional, IsEnum, IsEmail } from "class-validator";

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {

  @IsNumber()
  page: number;

  @IsNumber()
  pageSize: number;

  @MinLength(3)
  @IsOptional()
  sortBy?: string;

  @IsEnum(SortDir)
  sortDir?: string = SortDir.ASC;
}


export class CreateContactDto {

  @ApiProperty({example: 'Piotr'})
  @MinLength(3)
  name: string;
  
  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;
  
  @ApiProperty({example: 'hej hej hej'})
  @MinLength(3)
  message: string;
}

export class UpdateContactDto {
  name: string;
  message: string;
}
