import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, FindContactsDto } from './contacts.dto';
import { Contact } from './contacts.entity';

@Controller('contacts')
@ApiTags('Contacts')
@UsePipes()
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({
    transform: true, 
    transformOptions: {enableImplicitConversion: true}
  }))
  async find(@Query() query: FindContactsDto): Promise<Contact[]> {

    console.log('query', query);

    const contacts = await this.store.find(Contact, {
      take: query.pageSize,
      skip: query.pageSize*query.pageIndex,
    });

    return contacts;
  }

  @Post()
  async create(@Body() data: CreateContactDto): Promise<Contact> {

    const contact = new Contact(data);

    await this.store.save(contact);

    return contact;
  }

  @Get(':id')
  @UsePipes(ParseIntPipe)
  async findOne(@Param('id') id: number): Promise<Contact> {

    const contact = await this.store.findOneBy(Contact, { id });

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} not found`)
    }

    return contact;
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {

  }
}
