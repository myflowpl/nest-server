import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { RoleNames } from '../auth/auth.types.js';

/** Statusy konta. Enum o tych samych wartościach dodamy do schematu Prismy w lekcji D5. */
export const USER_STATUSES = ['ACTIVE', 'BLOCKED'] as const;
export type UserStatusName = (typeof USER_STATUSES)[number];

export class ListUsersQueryDto {
  /** Szukany tekst (w emailu lub nazwie wyświetlanej) */
  @IsOptional()
  @IsString()
  search?: string;

  /** Tylko użytkownicy z tą rolą */
  @IsOptional()
  @IsEnum(RoleNames)
  role?: RoleNames;

  /** Tylko użytkownicy z tym statusem (zadziała od lekcji D5) */
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatusName;

  /** Numer strony, liczony od 0 */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  pageIndex?: number = 0;

  /** Liczba rekordów na stronie */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  pageSize?: number = 10;

  @IsOptional()
  @IsIn(['createdAt', 'email', 'displayName'])
  sortBy?: 'createdAt' | 'email' | 'displayName' = 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc' = 'desc';
}

export class ExportUsersQueryDto {
  /** Tylko użytkownicy z tym statusem */
  @IsOptional()
  @IsIn(USER_STATUSES)
  status?: UserStatusName;
}

export class ChangeStatusDto {
  @IsIn(USER_STATUSES)
  status: UserStatusName;
}

export class BulkBlockDto {
  /** Id użytkowników do zablokowania (administratorzy są pomijani) */
  @ArrayNotEmpty()
  @IsInt({ each: true })
  ids: number[];
}
