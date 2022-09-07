import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { LoggerService } from '../logger/logger.service';
import { StorageService } from '../storage/storage.service';
import { Auth } from '../users/decorators/auth.decorator';
import { ContactExceptionDto, ContactsCreateDto, ContactsFindAllDto, ContactsUpdateDto, SimpleUser } from './contacts.dto';
import { Contact } from './contacts.entity';
import { SimpleGuard } from './simple.guard';


let data = [
  {id: 1, name: 'Piotr'},
  {id: 2, name: 'Paweł'},
]

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  constructor(
    private storage: StorageService,
    private logger: LoggerService,
  ) {}

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
  @UseGuards(SimpleGuard)
  @ApiBearerAuth()
  async create(@Body() contactDto: ContactsCreateDto, @Auth() user: SimpleUser): Promise<Contact> {

    console.log('AUTH USER', user)

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

  // @Get('autocomplete')
  // async autocomplete(@Req() req: Request) {

  //   const request$ = this.dataService.search('sdfsdf')

  //   const subscription = request$.subscribe(data => {
  //     // todo something with data
  //   })

  //   const ctrl = new AbortController()

  //   req.on('end', () => {
  //     ctrl.abort()
  //     subscription.unsubscribe();
  //   })

  //   const data1 =  await fetch('/get/data/from/here', {signal: ctrl.signal});
  //   const data2 =  await fetch('/get/data/from/here', {signal: ctrl.signal});

  //   return [data1, data2]
  // }
}
