import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, isString, IsString, Min, MinLength } from "class-validator";


export class CreateContactDto {
  @ApiProperty({example: 'Piotr'})
  name: string;
  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @ApiProperty({example: 'Welcome to nest'})
  message: string;
}

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {

  @IsNumber()
  @Min(1)
  // @IsOptional()
  page: number;

  @IsNumber()
  @Min(2)
  @IsOptional()
  pageSize: number = 2;

  @IsString()
  sortBy: string = 'email';

  sortDir: SortDir = SortDir.ASC;
}

export class UpdateContactsDto {

  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  message: string;
}