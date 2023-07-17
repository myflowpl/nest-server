import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { Contact } from './contacts.entity';
import { CreateContactDto, GetContactsDto } from './contacts.dto';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

    constructor(
        private store: StoreService,
    ) {}

    @Get()
    async findAll(@Query() query: GetContactsDto): Promise<Contact[]> {

        console.log(query, query.pageSize * query.pageIndex)

        const contacts = await this.store.find(Contact, {
            take: query.pageSize,
            skip: query.pageSize*query.pageIndex,
        });

        return contacts;
    }

    @Post()
    async create(@Body() data: CreateContactDto): Promise<Contact> {

        const contact = new Contact(data);

        await this.store.save(contact);

        return contact;
    }
}
