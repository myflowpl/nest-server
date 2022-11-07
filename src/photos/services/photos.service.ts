import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { rename } from 'fs/promises';
import { extname, resolve } from 'path';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { ConfigService } from '../../config';
import { User } from '../../users/entities/user.entity';
import { Photo } from '../photo.entity';
import { PhotoUploadDto } from '../photos.dto';

@Injectable()
export class PhotosService {

  constructor(
    private config: ConfigService,

    @InjectRepository(Photo)
    private photoRepository: Repository<Photo>
  ) {}

  async create(file: Express.Multer.File, data: PhotoUploadDto, user: User) {

    const filename = file.filename + extname(file.originalname).toLowerCase();

    const destFile = resolve(this.config.STORAGE_PHOTOS, filename);

    await rename(file.path, destFile);

    const photo = new Photo();
    photo.filename = filename;
    photo.description = data.description;
    photo.user = user;

    await this.photoRepository.save(photo);

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

  findAll() {
    return this.photoRepository.find().then(photos => photos.map(photo => ({
      thumbPath: '/thumbs/'+photo.filename,
      downloadPath: '/photos/download/'+photo.filename,
    })))
  }
}
