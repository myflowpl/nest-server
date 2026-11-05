import { Injectable } from '@nestjs/common';
import { UserStatus } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/index.js';

const DAY = 24 * 60 * 60 * 1000;

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  async overview() {
    // 1) groupBy: ilu użytkowników w każdym statusie
    const byStatus = await this.prisma.user.groupBy({ by: ['status'], _count: { _all: true } });

    // 2) licznik relacji: ilu użytkowników ma każdą rolę
    const roles = await this.prisma.role.findMany({
      select: { name: true, _count: { select: { users: true } } },
      orderBy: { name: 'asc' },
    });

    // 3) zwykły count z filtrem po dacie ostatniego logowania
    const activeLast7Days = await this.prisma.user.count({ where: { lastLoginAt: { gte: new Date(Date.now() - 7 * DAY) } } });

    return {
      total: byStatus.reduce((sum, row) => sum + row._count._all, 0),
      activeLast7Days,
      byStatus: Object.fromEntries(byStatus.map((row) => [row.status, row._count._all])) as Record<UserStatus, number>,
      byRole: Object.fromEntries(roles.map((role) => [role.name, role._count.users])),
    };
  }
}
