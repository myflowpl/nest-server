import { ApiProperty } from "@nestjs/swagger";

export class Photo {

    id: number;

    filename: string;

    description?: string;

    constructor(data?: Partial<Photo>) {
        Object.assign(this, data);
    }
}

export class PhotosUploadDto {

    @ApiProperty({ type: 'string', format: 'binary'})
    file: any;

    description?: string;
}