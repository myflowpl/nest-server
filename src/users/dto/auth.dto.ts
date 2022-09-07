import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";
import { RoleNames, User } from "../entities/user.entity";

export class AuthRegisterDto {

  @IsString()
  @MinLength(3)
  @ApiProperty({example: 'Piotr'})
  name: string;
  
  @IsEmail()
  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;
  
  @MinLength(3)
  @ApiProperty({example: '!@#'})
  password: string;
}
export class AuthRegisterResponse {
  user: User
}

export class AuthLoginDto {
  
  @IsEmail()
  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;
  
  @MinLength(3)
  @ApiProperty({example: '!@#'})
  password: string;
}
export class AuthLoginResponse {
  token: string;
  user: User
}

export class UserRoleDto {
  userId: number;
  roleName: RoleNames;
}