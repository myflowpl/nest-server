import { ApiProperty } from "@nestjs/swagger";
import { User } from "../users/entities/user.entity";

export class PhotoUploadDto {

  @ApiProperty({ type: 'string', format: 'binary'})
  file: any;

  description?: string;
}

export class Photo {

  id: number;

  filename: string;

  description?: string;

  user: User;

  constructor(data: Partial<Photo>) {
    Object.assign(this, data);
  }
}