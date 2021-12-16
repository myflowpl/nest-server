import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Render,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { stat } from 'fs/promises';
import { join } from 'path';
import { ConfigService } from '../../config';
import { Auth } from '../../users/decorators/auth.decorator';
import { User } from '../../users/entities/user.entity';
import { JwtAuthGuard } from '../../users/guards/jwt-auth.guard';
import { FileUploadDto } from '../dto/photos.dto';
import { PhotosService } from '../services/photos.service';

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {
  constructor(
    private photosService: PhotosService,
    private config: ConfigService,
  ) {}

  @Get()
  @Render('photos/index')
  async index() {
    const photos = await this.photosService.getUserPhotos();

    return { photos };
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body,
    @Auth() user: User,
  ) {
    const photo = await this.photosService.create(file, user);

    const thumbs = await this.photosService.createThumbs(photo.filename);

    return { file, body, photo, thumbs };
  }

  @Get('download/:filename')
  async download(@Param('filename') filename: string, @Res() res: Response) {
    const file = join(this.config.STORAGE_PHOTOS, filename);

    const stats = await stat(file).catch((e) => null);

    if (!stats) {
      throw new NotFoundException(`File "${filename}" not found`);
    }

    res.download(file, filename, (err) => {
      console.log('DOWNLOAD CB', err);
      if (err) {
        // handle error
      } else {
        // handle success
      }
    });
  }
}
