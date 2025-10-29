import { registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";

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