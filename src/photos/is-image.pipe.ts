import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import * as sharp from 'sharp';

@Injectable()
export class IsImagePipe implements PipeTransform {

  async transform(file: Express.Multer.File) {

    if(file.mimetype.split('/')[0] !== 'image') {
      throw new BadRequestException(`Image is required, ${file.mimetype} is not image`)
    }

    await sharp(file.path).stats().catch(() => {
      throw new BadRequestException(`Image is required, ${file.originalname} does not contain valid image`)
    })

    return file;
  }

}
