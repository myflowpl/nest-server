import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class IsImagePipe implements PipeTransform {

  async transform(file: Express.Multer.File, metadata: ArgumentMetadata) {

    await sharp(file.path).stats().catch(
      err => Promise.reject(new BadRequestException(`Uploaded file has to be an image file`))
    );

    return file;
  }
}
