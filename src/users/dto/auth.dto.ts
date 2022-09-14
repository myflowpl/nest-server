import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, MinLength } from "class-validator";
import { RoleNames, User } from "../entities/user.entity";

export class AuthRegisterDto {
  @ApiProperty({example: 'Piotr'})
  @MinLength(3)
  name: string;
  
  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;
  
  @ApiProperty({example: '!@#'})
  @MinLength(3)
  password: string;
}

export class AuthLoginDto {
  @ApiProperty({example: 'piotr@myflow.pl'})
  @IsEmail()
  email: string;
  
  @ApiProperty({example: '!@#'})
  @MinLength(3)
  password: string;
}

export class AuthLoginResponse {
  token: string;
  user: User;
  
  static create(data: Partial<AuthLoginResponse>): AuthLoginResponse {
    return Object.assign(new AuthLoginResponse(), data);
  }
}

export class AddRoleDto {
  userId: number;
  roleName: RoleNames;
}