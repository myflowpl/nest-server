import { Module } from '@nestjs/common';
import { StoreModule } from '../store/store.module';
import { UsersModule } from '../users/users.module';
import { TranslateController } from './translate.controller';

@Module({
  imports: [
    UsersModule,
    StoreModule,
  ],
  controllers: [TranslateController]
})
export class TranslatorModule {}
