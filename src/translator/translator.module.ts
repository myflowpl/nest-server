import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { TranslateController } from './translate.controller';

@Module({
  imports: [UsersModule],
  controllers: [TranslateController]
})
export class TranslatorModule {}
