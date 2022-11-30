import { Body, Controller, Get, Headers, Param, Post, Query, NotFoundException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, GetContactsDto } from './contact.dto';
import { Contact } from './contact.entity';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}

  @Get()
  async findAll(@Query() query: GetContactsDto) {

    console.log('QUERY', query)

    const contacts = await this.store.findAll(Contact);

    return contacts;
  }

  @Post()
  async create(@Body() data: CreateContactDto) {

    const contact = await this.store.create(Contact, data);

    return contact;
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {

    const contact = await this.store.findOne(Contact, +id);

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} was not found`);
    }

    return contact;
  }

}
