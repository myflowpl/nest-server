import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ContactsFindAllDto } from './contacts.dto';
import { Contact } from './contacts.entity';


const data = [
  {id: 1, name: 'Piotr'},
  {id: 2, name: 'Paweł'},
]

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  @Get()
  async findAll(@Query() query: ContactsFindAllDto): Promise<Contact[]> {

    console.log('QUERY PARAMS', query)

    return data.filter(contact => contact.id === parseInt(query.id, 10) || contact.name === query.name)
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {

    const contact = data.find(contact => contact.id === parseInt(id));

    if(!contact) {
      throw new NotFoundException(`Contact for id "${id}" was not found`);
    }

    return contact;
  }

  async create() {}

  async update() {}

  async remove() {}
}
