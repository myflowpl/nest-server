import { Injectable } from '@nestjs/common';
import { rename } from 'fs/promises';
import { extname, resolve } from 'path';
import { ConfigService } from '../../config';
import { PhotoUploadDto } from '../photos.dto';

@Injectable()
export class PhotosService {

  constructor(
    private config: ConfigService,
  ) {}

  async create(file: Express.Multer.File, data: PhotoUploadDto) {

    const filename = file.filename + extname(file.originalname).toLowerCase();

    const destFile = resolve(this.config.STORAGE_PHOTOS, filename);

    await rename(file.path, destFile);

    const photo = { filename, description: data.description };

    return photo;
  }
}
