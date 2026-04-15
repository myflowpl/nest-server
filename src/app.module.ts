import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ConfigModule } from './config/config.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { ApiModule } from './api-client-nest';
import { HttpModule } from '@nestjs/axios';
import { DbModule } from './db/db.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    StoreModule, 
    ConfigModule, 
    ContactsModule, 
    UsersModule,
    ApiModule,
    HttpModule,
    DbModule,
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
  ],
})
export class AppModule {}
