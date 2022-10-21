import { Injectable } from '@nestjs/common';
import { rename } from 'fs/promises';
import { extname, resolve } from 'path';
import * as sharp from 'sharp';
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

  async createThumbs(filename: string) {
    
    const srcFile = resolve(this.config.STORAGE_PHOTOS, filename);

    // SMALL thumbs
    const small = resolve(this.config.STORAGE_THUMBS, filename);

    await sharp(srcFile)
      .rotate()
      .resize(200, 200, { fit: 'cover', position: 'attention' })
      .jpeg({quality: 100})
      .toFile(small);

    // MEDIUM thumbs

    return { small }
  }
}
