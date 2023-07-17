export class CreateContactDto {
    name: string;
    email: string;
    message: string;
}

export enum SortDir {
    ASC = 'asc',
    DESC = 'desc',
}

export class GetContactsDto {
    pageIndex?: number;
    pageSize?: number;
    sortBy?: string;
    sortDir?: SortDir;
}
