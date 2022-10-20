import { BadRequestException, Body, Controller, Delete, Get, InternalServerErrorException, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, ErrorResponse, GetContactsDto, UpdateContactDto } from './contacts.dto';
import { Contact } from './contacts.entity';

@Controller('contacts')
@ApiTags('Contacts')
@ApiResponse({status: 400, type: ErrorResponse, description: 'Validation error'})
@ApiResponse({status: 500, type: ErrorResponse, description: 'Unknown error'})

export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({transform: true, transformOptions: {enableImplicitConversion: true}}))
  async findAll(@Query() query: GetContactsDto): Promise<Contact[]> {

    console.log(query)

    const contacts = await this.store.findAll(Contact);

    return contacts.slice((query.page-1) * query.pageSize, query.page * query.pageSize);
  }

  @Post()
  async create(@Body(ValidationPipe) data: CreateContactDto): Promise<Contact> {

    const existingEmail = await this.store.findAll(Contact).then(
      contacts => contacts.find(contact => contact.email === data.email)
    )

    if(existingEmail) {
      throw new BadRequestException(`Email ${data.email} is already taken`);
    }

    const contact = await this.store.create(Contact, data);

    if(!contact) {
      throw new InternalServerErrorException(`Something went wrong :(`);
    }

    return contact;
  }

  @Get(':id')
  @ApiResponse({status: 404, type: ErrorResponse, description: 'Contact not found'})
  async findOne(@Param('id', new ParseIntPipe()) id: number): Promise<Contact> {

    const contact = await this.store.findOne(Contact, id);

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} was not found`)
    }

    return contact;
  }

  @Delete(':id')
  @ApiResponse({status: 404, type: ErrorResponse, description: 'Contact not found'})
  @UsePipes(ParseIntPipe)
  async remove(@Param('id') id: number): Promise<number> {

    const contact = await this.store.findOne(Contact, id);

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} was not found`)
    }

    const c = await this.store.remove(Contact, id);

    return c;
  }

  @Patch(':id')
  @UsePipes()
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateContactDto): Promise<Contact> {

    const contact = await this.store.update(Contact, +id, data);

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} not found`)
    }

    return contact;
  }

}
