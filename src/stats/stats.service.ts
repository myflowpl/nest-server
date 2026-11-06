import { Injectable } from '@nestjs/common';
import { UserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/index.js';

const DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    
    const [byStatus, roles, activeLast7Days, registrations] = await Promise.all([
      // 1) groupBy: ilu użytkowników w każdym statusie
      this.prisma.user.groupBy({ by: ['status'], _count: { _all: true } }),

      // 2) licznik relacji: ilu użytkowników ma każdą rolę
      this.prisma.role.findMany({
        select: { name: true, _count: { select: { users: true } } },
        orderBy: { name: 'asc' },
      }),

      // 3) zwykły count z filtrem po dacie ostatniego logowania
      this.prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 7 * DAY) } } }),

      // 4) $queryRaw: zapytanie SQL, którego Prisma nie wyrazi (grupowanie po dniu)
      this.registrationsPerDay(14),
    ]);

    return {
      total: byStatus.reduce((sum, row) => sum + row._count._all, 0),
      activeLast7Days,
      byStatus: Object.fromEntries(byStatus.map((row) => [row.status, row._count._all])) as Record<UserStatus, number>,
      byRole: Object.fromEntries(roles.map((role) => [role.name, role._count.users])),
      registrationsPerDay: registrations,
    };
  }

  /**
   * Surowy SQL w tagged template: wartości (${since}) są przekazywane jako parametry, nie sklejane tekstem,
   * więc nie ma ryzyka SQL injection. `::int` zamienia COUNT (bigint) na zwykłą liczbę.
   */
  private registrationsPerDay(days: number) {
    const since = new Date(Date.now() - days * DAY);
    return this.prisma.$queryRaw<{ day: Date; count: number }[]>`
      SELECT date_trunc('day', "createdAt") AS day, COUNT(*)::int AS count
      FROM "User"
      WHERE "createdAt" >= ${since}
      GROUP BY 1
      ORDER BY 1`;
  }
}
