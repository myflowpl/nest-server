import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsEnum, IsNumber, IsOptional, Max, Min, MinLength } from "class-validator";

export class CreateContactDto {

  @ApiProperty({example: 'Piotr'})
  @MinLength(3)
  name: string;

  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'Hello NestJS World'})
  @MinLength(2)
  message: string;
}

export class ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {
  @IsNumber()
  @IsOptional()
  @Min(1)
  // @Transform((prop) => parseInt(prop.value, 10))
  page?: number = 1;
  
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(2)
  pageSize?: number = 2;

  sortBy?: string = 'name';

  @IsEnum(SortDir)
  sortDir?: SortDir = SortDir.ASC;
}

export class UpdateContactDto {
  name: string;
  message: string;
}