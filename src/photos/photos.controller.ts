import { Body, Controller, Get, Post, Render, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PhotosUploadDto } from './photo.entity';
import { PhotosService } from './photos.service';
import { IsImagePipe } from './pipes/is-image/is-image.pipe';
import { Auth } from '../users/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { ApiAuth } from '../users/decorators/api-auth.decorator';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

    constructor(
        private photosService: PhotosService,
    ) {}

    @Get()
    @Render('photos/index')
    async photos() {

        const title = 'Nest rendered HTML';

        const photos = await this.photosService.getPhotos();

        return { title, photos };
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
