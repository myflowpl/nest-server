import { ApiProperty } from "@nestjs/swagger";

export class CreateContactDto {

  @ApiProperty({example: 'Piotr'})
  name: string;

  @ApiProperty({example: 'piotr@myflow.pl'})
  email: string;

  @ApiProperty({example: 'Hello NestJS World'})
  message: string;
}

export class ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortDir?: SortDir;
}
