import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/index.js';
import { AuditQueryDto } from './audit.dto.js';

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private prisma: PrismaService) {}

  /** Ostatnie wpisy dziennika zdarzeń razem z danymi autora zdarzenia. */
  async list(query: AuditQueryDto) {
    const limit = Number(query.limit ?? 50);
    const where = query.action ? `WHERE a."action" = '${query.action}'` : '';
    this.logger.debug(`Lista audytu: ${where || 'bez filtra'}, limit ${limit}`);

    return this.prisma.$queryRawUnsafe(
      `SELECT a.*, u.* FROM "AuditLog" a LEFT JOIN "User" u ON u."id" = a."actorId" ${where} ORDER BY a."createdAt" DESC LIMIT ${limit}`,
    );
  }
}
