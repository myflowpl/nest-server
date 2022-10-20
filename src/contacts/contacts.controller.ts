import { BadRequestException, Body, Controller, Get, InternalServerErrorException, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, ErrorResponse, GetContactsDto } from './contacts.dto';
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
  async findAll(@Query() query: GetContactsDto): Promise<Contact[]> {

    const contacts = await this.store.findAll(Contact);

    return contacts.slice((query.page-1) * query.pageSize, query.page * query.pageSize);
  }

  @Post()
  async create(@Body() data: CreateContactDto): Promise<Contact> {

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
  async findOne(@Param('id') id: string): Promise<Contact> {

    const contact = await this.store.findOne(Contact, +id);

    return contact;
  }
}
