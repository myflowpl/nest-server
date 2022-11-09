import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PhotoUploadDto } from './photo.entity';
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
  async upload(
    @Body() data: PhotoUploadDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    
    const photo = await this.photosService.create(file, data);

    const thumbs = await this.photosService.createThumbs(photo.filename);

    return { file, data, photo, thumbs }
  }
}
