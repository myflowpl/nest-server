import { Global, Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { PrismaExceptionFilter } from './prisma-exception.filter.js';
import { PrismaService } from './prisma.service.js';

@Global()
@Module({
  providers: [PrismaService, { provide: APP_FILTER, useClass: PrismaExceptionFilter }],
  exports: [PrismaService],
})
export class PrismaModule {}
