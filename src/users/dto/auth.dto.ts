import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";

export class AuthRegisterDto {
    @MinLength(3)
    @ApiProperty({example: 'Piotr'})
    name: string;
    
    @IsEmail()
    @ApiProperty({example: 'piotr@myflow.pl'})
    email: string;
    
    @MinLength(4)
    @ApiProperty({example: '!@#$'})
    password: string;
}

