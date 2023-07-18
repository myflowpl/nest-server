import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength, ValidationArguments, ValidationOptions, registerDecorator } from "class-validator";
import { User } from "../entities/user.entity";
import { Type } from "class-transformer";

export class AuthRegisterDto {

    @ApiProperty({example: 'Piotr'})
    @MinLength(3)
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
    @Type(() => User)
    user: User;

    constructor(data?: AuthLoginResponse) {
        Object.assign(this, data);
    }
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