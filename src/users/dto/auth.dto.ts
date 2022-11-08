import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";
import { User } from "../entities/user.entity";
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';


export class AuthRegisterDto {

  @ApiProperty({example: 'Piotr'})
  name: string;

  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;

  @ApiProperty({example: '!@#$'})
  @IsPassword()
  password: string;
}

export class AuthLoginDto {

  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;

  @ApiProperty({example: '!@#$'})
  @IsPassword()
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
        message: 'Password has to be equal or grater then 4 characters',
        ...validationOptions,
      },
      validator: {
        validate(value: any, args: ValidationArguments) {
          // TODO dostosowac validacje
          return (''+value).length >=4;
        },
      },
    });
  };
}