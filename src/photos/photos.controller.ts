import { Body, Controller, Optional, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';
import { PhotosUploadDto } from './photo.entity';
import { PhotosService } from './photos.service';
import { Auth } from '../users/decorators/auth.decorator';
import { ApiAuth } from '../users/decorators/api-auth.decorator';
import { User } from '../users/entities/user.entity';

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
    @ApiAuth()
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: PhotosUploadDto,
        @Auth() user: User,
    ) {

        const photo = await this.photosService.create(file, data, user);

        return { file, data, photo }
    }
}
