import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '../config/index.js';
import { PrismaClient } from '../generated/prisma/client.js';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({ connectionString: config.DATABASE_URL }),
      // na developmencie wypisujemy SQL, który generuje Prisma
      log: config.DEBUG ? ['query', 'warn', 'error'] : ['warn', 'error'],
      // hasło nigdy nie wychodzi z bazy, chyba że poprosimy o nie wprost (omit: { passwordHash: false } albo select: { passwordHash: true })
      omit: { user: { passwordHash: true } },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
