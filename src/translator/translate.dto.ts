import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsString, Matches, MinLength } from "class-validator";

export class Translation {
  id: number;
  word: string;
  translation: string;
  language: Languages;
  userId: number;

  constructor(data?: Partial<Translation>) {
    Object.assign(this, data);
  }
}

export enum Languages {
  PL = 'pl',
  EN = 'en',
}

export class TranslateDto {
  @ApiProperty({example: 'witaj'})
  
  @IsString()
  @MinLength(1)
  // @Matches(/a-zA-Z/)
  word: string;
  
  @ApiProperty({example: 'en'})
  @IsEnum(Languages)
  translateFrom: Languages;
}

export class TranslateResponse {
  translation: string;
  language: Languages
}


export class AddWordDto {
  @ApiProperty({example: 'name'})
  @IsString()
  @MinLength(1)
  // @Matches(/a-zA-Z/)
  word: string;

  @ApiProperty({example: 'nazwa'})
  @IsString()
  @MinLength(1)
  // @Matches(/a-zA-Z/)
  translation: string;
  
  @ApiProperty({example: 'en'})
  @IsEnum(Languages)
  language: Languages;
}