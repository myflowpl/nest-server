
export class CreateContactDto {
  name: string;
  email: string;
  message?: string;
}

export enum SortDir {
  ASC = 'asc',
  DESC = 'desc',
}

export class GetContactsDto {
  page?: number;
  pageSize?: number;

  sortBy?: string;
  sortDir?: SortDir
}

export class ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
}

export class UpdateContactDto {
  name: string;
  message: string;
}