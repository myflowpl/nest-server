import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { AuthModule } from './auth/auth.module.js';
import { ConfigModule } from './config/index.js';
import { PrismaModule } from './prisma/index.js';
import { StatsModule } from './stats/stats.module.js';
import { UsersModule } from './users/users.module.js';

@Module({
  imports: [ConfigModule, PrismaModule, AuthModule, UsersModule, StatsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
