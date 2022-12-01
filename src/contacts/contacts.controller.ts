import { Body, Controller, Get, Headers, Param, Post, Query, NotFoundException, HttpException, HttpStatus, Delete, Patch, ParseIntPipe, UsePipes, ValidationPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, ErrorResponse, GetContactsDto, UpdateContactsDto } from './contact.dto';
import { Contact } from './contact.entity';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({transform: true, transformOptions: {enableImplicitConversion: false}}))
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
  @UsePipes(ParseIntPipe)
  async findOne(@Param('id') id: number) {

    const contact = await this.store.findOne(Contact, id);

    if(!contact) {
      throw new HttpException(`Contact for id ${id} was not found`, HttpStatus.NOT_FOUND);
      // throw new NotFoundException(`Contact for id ${id} was not found`);
    }

    return contact;
  }

  @Delete(':id')
  @UsePipes(ParseIntPipe)
  async remove(@Param('id') id: number) {
    
    const contact = await this.store.findOne(Contact, id);

// throw new Error('Hej, this is test error')

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} was not found`);
    }

    const c = await this.store.remove(Contact, id);

    return 'removed successfully';
  }

  @Patch(':id')
  @ApiResponse({status: 404, type: ErrorResponse, description: `Contact not found`})
  async update(
    @Param('id', new DefaultValuePipe(0), ParseIntPipe) id: number, 
    @Body( new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})) data: UpdateContactsDto,
  ): Promise<Contact> {

    let contact = await this.store.findOne(Contact, id);

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} was not found`);
    }

    const c = await this.store.update(Contact, id, data);

    return c;
  }
}
