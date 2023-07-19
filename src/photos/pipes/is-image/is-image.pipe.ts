import { ArgumentMetadata, BadRequestException, Injectable, Optional, PipeTransform } from '@nestjs/common';
import * as sharp from 'sharp';

export class Options {
  maxSize?: number;
}

@Injectable()
export class IsImagePipe implements PipeTransform {

  constructor(
    @Optional()
    private options?: Options,
  ) {}

  async transform(file: Express.Multer.File, metadata: ArgumentMetadata) {

    if(file.mimetype.indexOf('image') !== 0) {
      throw new BadRequestException(`Image is required, ${file.mimetype} is not valid image type`);
    }
    
    if(this.options?.maxSize) {
      if(file.size > this.options.maxSize) {
        throw new BadRequestException(`Image size is to big, max file size ${this.options.maxSize}, image size is ${file.size}`);
      }
    }

    await sharp(file.path).stats().catch(() => {
      throw new BadRequestException(`Image is required, ${file.originalname} does not contain valid image`)
    });

    return file;
  }
}
