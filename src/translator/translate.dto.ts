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

// const dto = new TranslateDto();

// dto.translateTo = Languages.PL;
// dto.word = 'witaj'

