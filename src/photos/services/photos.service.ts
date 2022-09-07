import { Injectable } from '@nestjs/common';
import { rename } from 'fs/promises';
import { extname, join } from 'path';
import { ConfigService } from '../../config';
import { PhotoUploadDto } from '../dto/photos.dto';

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
}
