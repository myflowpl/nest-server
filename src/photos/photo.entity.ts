import { Optional } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class PhotosUploadDto {

    @ApiProperty({ type: 'string', format: 'binary'})
    file: any;
    
    @ApiProperty({ example: 'test description'})
    @Optional()
    description?: string;
}