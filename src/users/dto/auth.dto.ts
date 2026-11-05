import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";
import { IsPassword } from "../validators/password.validator.js";
import { User } from "../entities/user.entity.js";

export class AuthRegisterDto {
    @ApiProperty({ example: 'Piotr' })
    @MinLength(3)
    name: string;

    @ApiProperty({ example: 'piotr@myflow.pl' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '!@#' })
    @IsPassword()
    password: string;
}

export class AuthLoginDto {
    @ApiProperty({ example: 'piotr@myflow.pl' })
    @IsEmail()
    email: string;

    @ApiProperty({ example: '!@#' })
    @IsPassword()
    password: string;
}

export class AuthLoginResponse {
    token: string;
    user: User;

    static create(data: Partial<AuthLoginResponse>): AuthLoginResponse {
        return Object.assign(new AuthLoginResponse(), data);
    }
}