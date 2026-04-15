import { Injectable } from '@nestjs/common';
import { PhotosUploadDto } from './photo.entity';
import { ConfigService } from '../config';
import { extname, resolve } from 'path';
import { rename } from 'fs/promises';

@Injectable()
export class PhotosService {

    constructor(
        private config: ConfigService,
    ) { }

    async create(file: Express.Multer.File, data: PhotosUploadDto) {

        // create new filename
        const filename = file.filename + extname(file.originalname).toLowerCase();

        // create destination path
        const destFile = resolve(this.config.STORAGE_PHOTOS, filename);

        // move file from tmp to storage
        await rename(file.path, destFile);

        // create photo entity
        const photo = {
            filename,
            description: data.description,
        };

        // return photo
        return photo;
    }

}
