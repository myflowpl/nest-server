import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";
import { IsPassword } from "../decorators/is-password.decorator";

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
