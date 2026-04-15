import { Body, Controller, Optional, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PhotosUploadDto } from './photo.entity';
import { PhotosService } from './photos.service';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

    constructor(
        private photosService: PhotosService,
    ) {}

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: PhotosUploadDto })
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: PhotosUploadDto,
    ) {

        await this.photosService.create(file, data);

        return { file, data }
    }
}
