import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { PhotoUploadDto } from '../photos.dto';
import { IsImagePipe } from '../pipes/is-image.pipe';
import { PhotosService } from '../services/photos.service';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

  constructor(
    private photosService: PhotosService,
  ) {}

  @Post('upload')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() data: PhotoUploadDto,
    @UploadedFile(IsImagePipe) file: Express.Multer.File
  ) {

    const photo = await this.photosService.create(file, data);

    const thumbs = await this.photosService.createThumbs(photo.filename);

    return { data, file, photo, thumbs };
  }
}
