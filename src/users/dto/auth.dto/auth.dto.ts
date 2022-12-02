import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

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