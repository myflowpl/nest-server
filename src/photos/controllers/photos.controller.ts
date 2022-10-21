import { Body, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../../users/decorators/api-auth.decorator';
import { Auth } from '../../users/decorators/auth.decorator';
import { User } from '../../users/entities/user.entity';
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
  @ApiAuth()
  async upload(
    @Body() data: PhotoUploadDto,
    @UploadedFile(IsImagePipe) file: Express.Multer.File,
    @Auth() user: User,
  ) {

    const photo = await this.photosService.create(file, data, user);

    const thumbs = await this.photosService.createThumbs(photo.filename);

    return { data, file, photo, thumbs };
  }
}
