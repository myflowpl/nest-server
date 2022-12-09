import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { query } from 'express';
import { ApiAuth } from '../users/decorators/api-auth.decorator';
import { Auth } from '../users/decorators/auth.decorator';
import { RoleNames, User } from '../users/entities/user.entity/user.entity';
import { AddWordDto, Languages, TranslateDto, TranslateResponse } from './translate.dto';

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
  @ApiAuth()
  async translateWord(@Query() data: TranslateDto, @Auth() user: User): Promise<TranslateResponse> {

    console.log('user', user.name, 'translates', data.word, 'to', data.translateTo);
    
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

  @Post('word')
  @ApiAuth(RoleNames.ADMIN)
  async addWord(@Body() data: AddWordDto): Promise<void> {

    const dir = (data.language === Languages.EN) ? this.en : this.pl;

    dir[data.word] = data.translation;

  }
}
