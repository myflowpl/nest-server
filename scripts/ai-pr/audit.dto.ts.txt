import { IsOptional, IsString } from 'class-validator';

export class AuditQueryDto {
  /** Filtr po nazwie akcji, np. `user.block` */
  @IsOptional()
  @IsString()
  action?: string;

  /** Ile wpisów zwrócić (domyślnie 50) */
  @IsOptional()
  limit?: string;
}
