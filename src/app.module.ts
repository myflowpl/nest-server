import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ConfigModule } from './config/config.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { TranslatorModule } from './translator/translator.module';

@Module({
  imports: [
    StoreModule,
    ConfigModule,
    ContactsModule,
    UsersModule,
    TranslatorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
