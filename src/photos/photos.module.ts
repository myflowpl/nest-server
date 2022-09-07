import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '../config';
import { PhotosController } from './controllers/photos.controller';
import { PhotosService } from './services/photos.service';

@Module({
  imports: [
    ConfigModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        dest: config.STORAGE_TMP
      })
    })
  ],
  controllers: [PhotosController],
  providers: [PhotosService]
})
export class PhotosModule {}
