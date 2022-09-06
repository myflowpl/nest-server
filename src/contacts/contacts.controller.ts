import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ContactExceptionDto, ContactsCreateDto, ContactsFindAllDto, ContactsUpdateDto } from './contacts.dto';
import { Contact } from './contacts.entity';


let data = [
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

  @ApiResponse({status: 404, type: ContactExceptionDto, description: 'Contact not found' })
  @ApiResponse({status: 500, type: ContactExceptionDto, description: 'Internal server error' })
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Contact> {

    const contact = data.find(contact => contact.id === parseInt(id));

    if(!contact) {
      throw new NotFoundException(`Contact for id "${id}" was not found`);
    }

    return contact;
  }

  @Post()
  async create(@Body() contactDto: ContactsCreateDto): Promise<Contact> {

    const contact: Contact = {
      ...contactDto,
      id: data.length +1,
    }

    data.push(contact);

    return contact;
  }

  @Patch(':id')
  @HttpCode(204)
  async update(@Body() contactDto: ContactsUpdateDto, @Param('id') id: string): Promise<Contact> {
    
    const contact = data.find(contact => contact.id === parseInt(id));

    if(!contact) {
      throw new NotFoundException(`Contact for id "${id}" was not found`);
    }

    const updatedContact: Contact = {
      ...contact,
      ...contactDto,
    };

    const index = data.findIndex(c => c === contact);

    data[index] = updatedContact;

    return updatedContact;
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<number> {

    const index = data.findIndex(contact => contact.id === parseInt(id));

    if(index < 0) {
      throw new NotFoundException(`Contact for id "${id}" was not found`);
    }

    data = data.filter(c => c.id !== parseInt(id))

    return parseInt(id);
  }
}
