import { ApiProperty } from "@nestjs/swagger";
import { Exclude } from "class-transformer";
import { IsEmail, MinLength } from "class-validator";

export class AuthRegisterDto {
  @ApiProperty({example: 'Piotr'})
  @MinLength(3)
  name: string;
  
  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;
  
  @ApiProperty({example: '!@#'})
  @MinLength(3)
  password: string;
}