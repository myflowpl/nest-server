import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactsFindAllDto } from './contacts.dto';
import { Contact } from './contacts.entity';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  @Get()
  async findAll(@Query() query: ContactsFindAllDto): Promise<Contact[]> {

    console.log('QUERY PARAMS', query)

    const data = [
      {id: 1, name: 'Piotr'},
      {id: 2, name: 'Paweł'},
    ]

    return data.filter(contact => contact.id === parseInt(query.id, 10) || contact.name === query.name)
  }

  async findOne() {}

  async create() {}

  async update() {}

  async remove() {}
}
