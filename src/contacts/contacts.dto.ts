import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString, MinLength } from "class-validator";

export class CreateContactDto {

  @ApiProperty({example: 'Piotr'})
  @MinLength(3)
  name: string;

  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;

  @ApiProperty({example: 'NestJS trainer'})
  @IsString()
  description: string;
}

export class UpdateContactDto {

  @ApiProperty({example: 'Piotr'})
  @MinLength(3)
  name: string;

  @ApiProperty({example: 'NestJS trainer'})
  @IsString()
  description: string;
}

export class FindContactsDto {

  @IsNumber()
  pageIndex: number = 0;

  @IsNumber()
  pageSize: number = 2;
}