import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { User } from "../entities/user.entity";


export class AuthRegisterDto {

  @MinLength(3)
  @ApiProperty({example: 'Piotr'})
  name: string;
  
  @IsEmail()
  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;
  
  @IsPassword()
  @ApiProperty({example: '!@#'})
  password: string;
}

export class AuthLoginDto {
  
  @IsEmail()
  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;
  
  @IsPassword()
  @ApiProperty({example: '!@#'})
  password: string;
}

export class AuthLoginResponse {
  token: string;
  user: User;
}

export function IsPassword(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPassword',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: {
        message: 'Password has to be >= 3 chars',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          return (''+value).length >= 3;
        },
      },
    });
  };
}