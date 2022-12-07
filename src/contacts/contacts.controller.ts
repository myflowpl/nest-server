import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto } from './contacts.dto';
import { Contact } from './contacts.entity';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}

  @Get()
  async find(): Promise<Contact[]> {

    return [
      {id: 1, name: 'Piotr', email: 'test', description: 'desc'}
    ];
  }

  @Post()
  async create(@Body() data: CreateContactDto): Promise<Contact> {

    const contact = new Contact(data);

    await this.store.save(contact);

    return contact;
  }
}
