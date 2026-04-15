import { Injectable } from '@nestjs/common';
import { PhotosUploadDto } from './photo.entity';
import { ConfigService } from '../config';
import { extname, resolve } from 'path';
import { rename } from 'fs/promises';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';
// import * as sharp from 'sharp';
const sharp = require('sharp');

@Injectable()
export class PhotosService {

    constructor(
        private config: ConfigService,
        private prisma: PrismaService,
    ) { }

    async create(file: Express.Multer.File, data: PhotosUploadDto, user: User) {

        // create new filename
        const filename = file.filename + extname(file.originalname).toLowerCase();

        // create destination path
        const destFile = resolve(this.config.STORAGE_PHOTOS, filename);

        // move file from tmp to storage
        await rename(file.path, destFile);

        // create photo entity
        const photo = await this.prisma.photo.create({
            data: {
                filename,
                description: data.description,
                userId: user.id,
            }
        })
        

        // return photo
        return photo;
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
