import { ApiProperty } from "@nestjs/swagger";

export enum Languages {
  PL = 'pl',
  EN = 'en',
}

export class TranslateDto {
  @ApiProperty({example: 'witaj'})
  word: string;
  
  @ApiProperty({example: 'en'})
  translateTo: Languages;
}

export class TranslateResponse {
  translation: string;
  language: Languages
}


export class AddWordDto {
  @ApiProperty({example: 'name'})
  word: string;

  @ApiProperty({example: 'nazwa'})
  translation: string;
  
  @ApiProperty({example: 'en'})
  language: Languages;
}