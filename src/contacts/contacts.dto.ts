import { Transform, Type } from "class-transformer";
import { IsEmail, IsNumber, IsOptional, Max, MinLength } from "class-validator";

export class CreateContactDto {
  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;
  
  message?: string;
}

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {

  @IsNumber()
  @IsOptional()
  page?: number = 1;
  
  @IsNumber()
  @Max(5)
  @IsOptional()
  @Transform((data) => parseInt(data.value))
  @Type()
  pageSize?: number =2 ;

  sortBy?: string = 'name';
  sortDir?: SortDir = SortDir.ASC
}

export class ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export class UpdateContactDto {
  name: string;
  message: string;
}