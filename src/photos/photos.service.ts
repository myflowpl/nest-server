import { Injectable } from '@nestjs/common';
import { Photo, PhotosUploadDto } from './photo.entity';
import { extname, resolve } from 'path';
import { ConfigService } from '../config';
import { rename } from 'fs/promises';
import * as sharp from 'sharp';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PhotosService {

    constructor(
        private config: ConfigService,

        @InjectRepository(Photo)
        private photosRepository: Repository<Photo>
    ) {}

    async create(file: Express.Multer.File, data: PhotosUploadDto, user: User) {

        // create new filename, tmp filenam + orginal extension
        const filename = file.filename + extname(file.originalname).toLowerCase();

        // create destination path, config.STORAGE_PHOTOS + new filename
        const destFile = resolve(this.config.STORAGE_PHOTOS, filename);

        // move file from tmp to storage
        await rename(file.path, destFile);

        // create photo entity
        const photo = new Photo({ 
            filename, 
            description: data.description,
            user,
        });

        // persist entity in database
        await this.photosRepository.save(photo);

        // return photo
        return photo;
    }

    async createThumbs(fielname: string) {

        // source file path
        const srcFile = resolve(this.config.STORAGE_PHOTOS, fielname);
        
        // dest thumb file path
        const destFile = resolve(this.config.STORAGE_THUMBS, fielname);

        // creathe thumb
        await sharp(srcFile)
            .rotate()
            .resize(200, 200, { })
            .jpeg({ quality: 100 })
            .toFile(destFile);

        // TODO repeat for other sizes

        // return thumb info
        return {
            thumb: destFile
        }
    }
}
