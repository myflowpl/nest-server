import { Injectable } from '@nestjs/common';
import { rename } from 'fs/promises';
import { extname, join, resolve } from 'path';
import { ConfigService } from '../../config';
import { PhotoUploadDto } from '../dto/photos.dto';
import * as sharp from 'sharp';

@Injectable()
export class PhotosService {

  constructor(
    private config: ConfigService,
  ) {}

  async create(file: Express.Multer.File, data: PhotoUploadDto) {

    // nowa nazwa pliku
    const filename = file.filename + extname(file.originalname).toLowerCase();

    // katalog i plik gzie zapiszem to zjecie
    const destFile = join(this.config.STORAGE_PHOTOS, filename);

    // przeniesienie z tmp do storage
    await rename(file.path, destFile);

    // return photo object

    return { filename }
  }

  
  async createThumbs(filename: string) {

    const srcFile = resolve(this.config.STORAGE_PHOTOS, filename);

    // create small thumb
    const smallDestFile = resolve(this.config.STORAGE_THUMBS, filename);

    await sharp(srcFile)
      .rotate()
      .resize(200, 200, { fit: 'cover', position: 'attention' })
      .jpeg({ quality: 100})
      .toFile(smallDestFile);

    // TOTO dodac inne wielkosci

    return {
      small: smallDestFile,
    }
  }

}
