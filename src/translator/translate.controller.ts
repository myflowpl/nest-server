import { Controller, Get, Query } from '@nestjs/common';
import { query } from 'express';
import { Languages, TranslateDto, TranslateResponse } from './translate.dto';

@Controller('translate')
export class TranslateController {

  en = {
    'hello': 'witaj',
  };
  pl = {
    'witaj': 'hello',
  };

  /**
   * GET /translate/word
   * request query: word=witaj, translateTo=en
   * 
   * http://localhost:3000/translate/word?word=witaj&translateTo=en
   * 
   * Auth: logged in user
   */
  @Get('word')
  async translateWord(@Query() data: TranslateDto): Promise<TranslateResponse> {

    const dir = (data.translateTo === Languages.EN) ? this.pl : this.en;

    const translation = dir[data.word.toLowerCase()];

    return {
      translation,
      language: data.translateTo
    }
  }

  /**
   * POST /translate
   * request body: plWord=witaj enWord=hello
   * 
   * Auth: ADMIN
   */

}
