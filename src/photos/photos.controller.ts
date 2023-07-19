import { Body, Controller, Get, Param, Post, Render, Res, StreamableFile, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PhotosUploadDto } from './photo.entity';
import { PhotosService } from './photos.service';
import { IsImagePipe } from './pipes/is-image/is-image.pipe';
import { Auth } from '../users/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { ApiAuth } from '../users/decorators/api-auth.decorator';
import { Response } from 'express';
import { join } from 'path';
import { ConfigService } from '../config';
import { createReadStream } from 'fs';
import { DownloadFile, DownloadInterceptor } from './interceptors/download/download.interceptor';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

    constructor(
        private photosService: PhotosService,
        private config: ConfigService,
    ) {}

    @Get()
    @Render('photos/index')
    async photos() {

        const title = 'Nest rendered HTML';

        const photos = await this.photosService.getPhotos();

        return { title, photos };
    }

    @Get('download/:filename')
    // @UseInterceptors(DownloadInterceptor)
    donwload(@Param('filename') filename: string) {

        const file = join(this.config.STORAGE_PHOTOS, filename);
        // console.log('donwload start', file);
        // return new DownloadFile({file, name: 'downloaded-file.jpg'});

        return new StreamableFile(createReadStream(file), {disposition: 'attachment; filename="plik.jpg"'});
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: PhotosUploadDto, description: 'Upload photo with description' })
    async upload(
        @UploadedFile(new IsImagePipe()) file: Express.Multer.File,
        @Body() data: PhotosUploadDto,
        @Auth() user: User,
    ) {

        const photo = await this.photosService.create(file, data, user);
        
        const thumbs = await this.photosService.createThumbs(photo.filename);

        return { file, data, photo, thumbs}
    }
}
