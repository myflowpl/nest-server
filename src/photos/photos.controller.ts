import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../users/decorators/api-auth.decorator';
import { Auth } from '../users/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { IsImagePipe } from './is-image/is-image.pipe';
import { PhotoUploadDto } from './photo.entity';
import { PhotosService } from './photos.service';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

  constructor(
    private photosService: PhotosService,
  ) {}

  @Post('upload')
  @ApiAuth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async upload(
    @Body() data: PhotoUploadDto,
    @UploadedFile(IsImagePipe) file: Express.Multer.File,
    @Auth() user: User,
  ) {
    
    const photo = await this.photosService.create(file, data, user);

    const thumbs = await this.photosService.createThumbs(photo.filename);

    return { file, data, photo, thumbs }
  }
}
