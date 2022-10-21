import { IsEmail, MinLength } from "class-validator";
import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';


export class AuthRegisterDto {

  @MinLength(3)
  name: string;

  @IsEmail()
  email: string;

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