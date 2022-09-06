import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsEmail, IsNumber, MinLength } from "class-validator";

export class ContactsFindAllDto {
  name?: string
  // @IsNumber()
  @Type(() => Number)
  // @Transform(({ value }) => parseInt(value, 10) )
  id?: number
  
  @Type(() => Date)
  // @Transform(({ value }) => new Date(value) )
  createdAt?: Date
} 

export class ContactExceptionDto {
  statusCode: number;
  message: string;
  error: string;
}

export class ContactsCreateDto {
  @ApiProperty({example: 'Iwona'})
  @MinLength(3)
  name: string;

  @ApiProperty({example: 'iwona@myflow.pl'})
  @IsEmail()
  email: string;
}

export class ContactsUpdateDto {
  @ApiProperty({example: 'Julia'})
  name: string;
}
