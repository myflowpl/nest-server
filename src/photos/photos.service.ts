import { Injectable } from '@nestjs/common';
import { rename } from 'fs/promises';
import { extname, resolve } from 'path';
import { ConfigService } from '../config';
import { Photo, PhotoUploadDto } from './photo.entity';

@Injectable()
export class PhotosService {

  constructor(
    private config: ConfigService,
  ) {}

  async create(file: Express.Multer.File, data: PhotoUploadDto) {

    // create new filename
    const filename = file.filename + extname(file.originalname).toLowerCase();

    // create destination path
    const destFile = resolve(this.config.STORAGE_PHOTOS, filename);

    // move file from tmp to storage
    await rename(file.path, destFile);

    // create photo entity
    const photo = new Photo({
      filename
    });

    // return photo
    return photo;
  }
}
