import { ApiProperty } from "@nestjs/swagger";

export class CreateContactDto {

  @ApiProperty({example: 'Piotr'})
  name: string;
  
  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @ApiProperty({example: 'NestJS trainer'})
  description: string;
}