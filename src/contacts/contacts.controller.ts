import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, GetContactsDto, UpdateContactDto } from './contacts.dto';
import { Contact } from './contacts.entity';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}
  
  @Get()
  async findAll(@Query() query: GetContactsDto): Promise<Contact[]> {

    const contacts = await this.store.findAll(Contact);

    return contacts.slice((query.page-1) * query.pageSize, query.page * query.pageSize)

  }

  @Post()
  async create(@Body() data: CreateContactDto): Promise<Contact> {

    const existingEmail = await this.store.findAll(Contact).then(
      contacts => contacts.find(contact => contact.email === data.email)
    )

    if(existingEmail) {
      throw new BadRequestException(`Email ${data.email} jest już zajęty`)
    }

    const contact = await this.store.create(Contact, data);

    return contact;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {

    const contact = await this.store.findOne(Contact, +id);

    if(!contact) {
      throw new NotFoundException(`Contact by id ${id} not found`)
    }

    return contact;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateContactDto): Promise<Contact> {

    const contact = await this.store.update(Contact, +id, data);

    if(!contact) {
      throw new NotFoundException(`Contact by id ${id} not found`)
    }

    return contact;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<number> {
    
    const contact = await this.store.remove(Contact, +id);

    if(!contact) {
      throw new NotFoundException(`Contact by id ${id} not found`)
    }

    return contact;
  }
}
