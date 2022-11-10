import { Body, Controller, ForbiddenException, Get, NotFoundException, Param, Post, Render, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';
import { ConfigService } from '../config';
import { ApiAuth } from '../users/decorators/api-auth.decorator';
import { Auth } from '../users/decorators/auth.decorator';
import { User } from '../users/entities/user.entity';
import { IsImagePipe } from './is-image.pipe';
import { PhotoUploadDto } from './photo.entity';
import { PhotosService } from './photos.service';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

  constructor(
    private photosService: PhotosService,
    private config: ConfigService,
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

  @Get()
  @Render('photos/index')
  async photos() {

    const title = 'Nest rendered HTML';

    const photos = await this.photosService.getPhotos();

    return { title, photos }
  }

  
  @Get('download/:filename')
  @ApiAuth()
  async download(@Param('filename') filename: string, @Res() res: Response, @Auth() user: User) {

    const photo = await this.photosService.getByName(filename);

    if(!photo) {
      throw new NotFoundException(`Photo ${filename} not found`);
    }

    if (photo.user.id !== user.id) {
      throw new ForbiddenException("Sorry! You can't see that.")
    }
    
    const file = join(this.config.STORAGE_PHOTOS, filename)

    res.download(file, filename, function (err) {
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
      } else {
        // decrement a download credit, etc.
      }
    })
    
  }
}
