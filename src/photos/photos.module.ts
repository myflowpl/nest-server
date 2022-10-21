import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '../config';
import { UsersModule } from '../users/users.module';
import { PhotosController } from './controllers/photos.controller';
import { Photo } from './photo.entity';
import { PhotosService } from './services/photos.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    TypeOrmModule.forFeature([Photo]),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory(config: ConfigService) {
          return {
            dest: config.STORAGE_TMP,
          }
      },
    }),
  ],
  controllers: [PhotosController],
  providers: [PhotosService]
})
export class PhotosModule {}
