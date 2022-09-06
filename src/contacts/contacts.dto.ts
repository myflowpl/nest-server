import { ApiProperty } from "@nestjs/swagger";

export class ContactsFindAllDto {
  name?: string
  id?: string
}

export class ContactExceptionDto {
  statusCode: number;
  message: string;
  error: string;
}

export class ContactsCreateDto {
  @ApiProperty({example: 'Iwona'})
  name: string;

  @ApiProperty({example: 'iwona@myflow.pl'})
  email: string;
}

export class ContactsUpdateDto {
  @ApiProperty({example: 'Julia'})
  name: string;
}
