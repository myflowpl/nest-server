import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from './config/index.js';
import { StatsModule } from './stats/stats.module.js';
import { UsersModule } from './users/users.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [ConfigModule, AuthModule, UsersModule, StatsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
