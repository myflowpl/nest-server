import { BadRequestException, Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, ErrorResponse, GetContactsDto, UpdateContactDto } from './contacts.dto';
import { Contact } from './contacts.entity';

@Controller('contacts')
@ApiTags('Contacts')
@ApiResponse({status: 500, type: ErrorResponse, description: 'Internal Server Error'})
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}

  @Get()
  async findAll(@Query() query: GetContactsDto): Promise<Contact[]> {

    const contacts = await this.store.findAll(Contact)

    return contacts.slice(
      (query.page-1)*query.pageSize,
      query.page * query.pageSize
    );
  }

  @Post()
  async create(@Body() data: CreateContactDto): Promise<Contact> {

    const existingEmail = await this.store.findAll(Contact).then(
      contacts => contacts.find(c => c.email === data.email)
    )

    if(existingEmail) {
      throw new BadRequestException(`Email ${data.email} is already taken`)
    }

    const contact = await this.store.create(Contact, data);

    return contact;
  }

  @Get(':id')
  @ApiResponse({status: 404, type: ErrorResponse, description: 'Contact not found'})
  async findOne(@Param('id') id: string) {

    const contact = await this.store.findOne(Contact, +id);

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} not found`);
    }

    return contact
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() data: UpdateContactDto) {

    const contact = await this.store.update(Contact, +id, data);

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} not found`);
    }

    return contact;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {

    const contact = await this.store.remove(Contact, +id);
    
    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} not found`);
    }

    return contact;
  }
}
