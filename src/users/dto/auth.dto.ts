import { ApiProperty } from "@nestjs/swagger";
import { User } from "../entities/user.entity";

export class AuthRegisterDto {

  @ApiProperty({example: 'Piotr'})
  name: string;

  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @ApiProperty({example: '!@#$'})
  password: string;
}

export class AuthLoginDto {

  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @ApiProperty({example: '!@#$'})
  password: string;
}

export class AuthLoginResponse {
  token: string;
  user: User;
}