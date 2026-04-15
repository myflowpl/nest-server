import { Injectable } from '@nestjs/common';
import { PhotosUploadDto } from './photo.entity';
import { ConfigService } from '../config';
import { extname, resolve } from 'path';
import { rename } from 'fs/promises';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '../users/entities/user.entity';

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

}
