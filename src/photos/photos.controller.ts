import { Body, Controller, Optional, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiProperty, ApiTags } from '@nestjs/swagger';

export class PhotosUploadDto {

    @ApiProperty({ type: 'string', format: 'binary'})
    file: any;
    
    @ApiProperty({ example: 'test description'})
    @Optional()
    description?: string;
}

@Controller('photos')
@ApiTags('Photos')
export class PhotosController {

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: PhotosUploadDto })
    async upload(
        @UploadedFile() file: Express.Multer.File,
        @Body() data: PhotosUploadDto,
    ) {

        return { file, data }
    }
}
