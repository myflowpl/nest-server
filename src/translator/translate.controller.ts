import { Body, Controller, Get, Post, Query, BadRequestException, NotFoundException, ValidationPipe, Patch, ForbiddenException } from '@nestjs/common';
import { query } from 'express';
import { Contact } from '../contacts/contacts.entity';
import { StoreService } from '../store/store.service';
import { ApiAuth } from '../users/decorators/api-auth.decorator';
import { Auth } from '../users/decorators/auth.decorator';
import { RoleNames, User } from '../users/entities/user.entity/user.entity';
import { AddWordDto, Languages, TranslateDto, TranslateResponse, Translation } from './translate.dto';

@Controller('translate')
export class TranslateController {

  constructor(
    private store: StoreService,
  ) {}

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
  async translateWord(@Query() data: TranslateDto, @Auth() user: User): Promise<Translation> {

    const word = data.word.toLowerCase();

    const language = data.translateFrom;

    const translation = await this.store.findOneBy(Translation, { word, language });

    if(!translation) {
      throw new NotFoundException(`word not found`)
    }

    return translation;
  }

  /**
   * POST /translate
   * request body: plWord=witaj enWord=hello
   * 
   * Auth: ADMIN
   */

  @Post('word')
  @ApiAuth(RoleNames.ADMIN)
  async addWord(@Body(ValidationPipe) data: AddWordDto, @Auth() user: User): Promise<Translation> {

    const exists = await this.store.findOneBy(Translation, {
      word: data.word, 
      language: data.language
    })

    if(exists) {
      throw new BadRequestException(`Word already exists`);
    }

    const translation = new Translation(data);

    translation.userId = user.id;

    await this.store.save(translation);

    return translation;
  }

  @Patch('word')
  @ApiAuth(RoleNames.ADMIN)
  async updateWord(@Body(ValidationPipe) data: AddWordDto, @Auth() user: User): Promise<Translation> {

    
    const translation = await this.store.findOneBy(Translation, {
      word: data.word, 
      language: data.language
    })

    if(!translation) {
      throw new NotFoundException(`Word not found`);
    }

    if(translation.userId !== user.id) {
      throw new ForbiddenException(`Word not found`);
    }

    const updated = await this.store.update(Translation, data, {word: data.word, language: data.language})

    return updated;
  }
}
