import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PhotosUploadDto } from './photo.entity';
import { PhotosService } from './photos.service';
import { IsImagePipe } from './pipes/is-image/is-image.pipe';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

    constructor(
        private photosService: PhotosService,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: PhotosUploadDto, description: 'Upload photo with description' })
    async upload(
        @UploadedFile(new IsImagePipe({maxSize: 1000})) file: Express.Multer.File,
        @Body() data: PhotosUploadDto
    ) {

        const photo = await this.photosService.create(file, data);
        
        const thumbs = await this.photosService.createThumbs(photo.filename);

        return { file, data, photo, thumbs}
    }
}
