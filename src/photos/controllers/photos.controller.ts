import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PhotoUploadDto } from '../dto/photos.dto';
import { PhotosService } from '../services/photos.service';

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
    @UploadedFile() file: Express.Multer.File,
    @Body() body: PhotoUploadDto
  ) {

    const photo = await this.photosService.create(file, body)

    const thumbs = await this.photosService.createThumbs(photo.filename)

    return { file, body, photo, thumbs }
  }
}
