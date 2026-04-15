import { Module } from '@nestjs/common';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigService } from '../config';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dest: config.STORAGE_TMP,
      })
    }),
  ],
  controllers: [PhotosController],
  providers: [PhotosService]
})
export class PhotosModule {}
