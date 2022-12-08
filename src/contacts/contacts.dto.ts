import { ApiProperty } from "@nestjs/swagger";
import { IsNumber } from "class-validator";

export class CreateContactDto {

  @ApiProperty({example: 'Piotr'})
  name: string;

  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @ApiProperty({example: 'NestJS trainer'})
  description: string;
}

export class UpdateContactDto {

  @ApiProperty({example: 'Piotr'})
  name: string;

  @ApiProperty({example: 'NestJS trainer'})
  description: string;
}

export class FindContactsDto {

  @IsNumber()
  pageIndex: number = 0;

  @IsNumber()
  pageSize: number = 2;
}