
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from 'generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    //The onModuleInit is optional
    // if you leave it out, Prisma will connect lazily on its first call to the database.
    await this.$connect();
  }
}

export { Prisma };