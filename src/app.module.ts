import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from './config/config.module';
import { PhotosModule } from './photos/photos.module';
import { DbModule } from './db/db.module';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [UsersModule, ConfigModule, PhotosModule, DbModule],
  controllers: [AppController],
  providers: [AppService, ChatGateway],
  exports: [],
})
export class AppModule {}
