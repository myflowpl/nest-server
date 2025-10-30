
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Prisma } from 'generated/prisma/client';
import {resolve } from 'path';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  async onModuleInit() {
    //The onModuleInit is optional
    // if you leave it out, Prisma will connect lazily on its first call to the database.
    await this.$connect();

    // const tables = await this.$queryRaw<
    // { name: string }[]
    // >`SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;`;

    // console.log(tables.map(t => t.name));

    // const dbUrl = process.env.DATABASE_URL!;
    // const dbPath = resolve(process.cwd(), dbUrl.replace(/^file:/, ''));
    // console.log('Connected to SQLite DB file:', dbPath);
  }
}

export { Prisma };