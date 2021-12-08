import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileUploadDto } from '../dto/photos.dto';
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
  @ApiBody({type: FileUploadDto})
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: any) {

    const photo = await this.photosService.create(file);

    const thumbs = await this.photosService.createThumbs(photo.filename);

    return {file, body, thumbs};
  }
}
