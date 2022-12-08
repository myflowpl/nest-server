import { ApiProperty } from "@nestjs/swagger";

export class AuthRegisterDto {

  @ApiProperty({example: 'Piotr'})
  name: string;

  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @ApiProperty({example: '!@#$'})
  password: string;
}
