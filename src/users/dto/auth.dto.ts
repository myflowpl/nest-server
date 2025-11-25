import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { User } from "../entities/user.entity";

export class AuthRegisterDto {
    @MinLength(3)
    @ApiProperty({example: 'Piotr'})
    name: string;
    
    @IsEmail()
    @ApiProperty({example: 'piotr@myflow.pl'})
    email: string;
    
    @IsPassword()
    @ApiProperty({example: '!@#$'})
    password: string;
}

export class AuthLoginDto {
    
    @IsEmail()
    @ApiProperty({example: 'piotr@myflow.pl'})
    email: string;
    
    @IsPassword()
    @ApiProperty({example: '!@#$'})
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
