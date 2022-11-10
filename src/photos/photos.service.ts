import { Injectable } from '@nestjs/common';
import { rename } from 'fs/promises';
import { extname, resolve } from 'path';
import { ConfigService, joinUrl } from '../config';
import { Photo, PhotoDto, PhotoUploadDto } from './photo.entity';
import * as sharp from 'sharp';
import { User } from '../users/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PhotosService {

  constructor(
    private config: ConfigService,

    @InjectRepository(Photo)
    private photosRepository: Repository<Photo>
  ) {}

  async create(file: Express.Multer.File, data: PhotoUploadDto, user: User) {

    // create new filename
    const filename = file.filename + extname(file.originalname).toLowerCase();

    // create destination path
    const destFile = resolve(this.config.STORAGE_PHOTOS, filename);

    // move file from tmp to storage
    await rename(file.path, destFile);

    // create photo entity
    const photo = new Photo({
      filename,
      description: data.description,
      user
    });

    // save entity
    await this.photosRepository.save(photo);
    
    // return photo
    return photo;
  }

  async createThumbs(filename: string) {

    // create src file path
    const srcFile = resolve(this.config.STORAGE_PHOTOS, filename);
    
    // create small thumbs
    const small = resolve(this.config.STORAGE_THUMBS, filename);

    await sharp(srcFile)
      .rotate()
      .resize(200, 200, { fit: 'cover', position: 'attention'})
      .jpeg({quality: 100})
      .toFile(small);

    // other sizes

    return { small };
  }

  async getPhotos(): Promise<PhotoDto[]> {

    const photos = await this.photosRepository.find();

    return photos.map(photo => ({
      id: photo.id,
      description: photo.description,
      thumbUrl: joinUrl(this.config.PHOTOS_BASE_PATH ,photo.filename),
      downloadUrl: joinUrl(this.config.PHOTOS_DOWNLOAD_PATH ,photo.filename),
    }));
  }

  async getByName(filename: string): Promise<Photo | null> {

    return this.photosRepository.findOneBy({filename});

  }
}
