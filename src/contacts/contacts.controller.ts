import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  async findAll(@Query(new ValidationPipe({transform: true})) query: ContactsFindAllDto): Promise<Contact[]> {

    console.log('QUERY PARAMS', query)

    return data.filter(contact => contact.id === query.id || contact.name === query.name)
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
  @UsePipes( new ValidationPipe() )
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
    
    const contact = await this.findOne(id);

    const updatedContact: Contact = {
      ...contact,
      ...contactDto,
    };

    const index = data.findIndex(c => c === contact);

    data[index] = updatedContact;

    return updatedContact;
  }

  @Delete(':id')
  @ApiParam({name: 'id', type: String})
  @UsePipes(ValidationPipe)
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<number> {

    const index = data.findIndex(contact => contact.id === id);

    if(index < 0) {
      throw new NotFoundException(`Contact for id "${id}" was not found`);
    }

    data = data.filter(c => c.id !== id)

    return id;
  }
}
