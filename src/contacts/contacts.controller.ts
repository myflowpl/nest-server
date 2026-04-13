import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateContactDto, CreateContactResponse } from './contacts.dto';
import { Contact } from './contacts.entity';
import { StoreService } from '../store/store.service';

@Controller('contacts')
@ApiTags("Contacts")
export class ContactsController {

    constructor(
        private store: StoreService,
    ) {}

    @Get()
    async findAll() {
        
        const contacts = await this.store.find(Contact);

        return contacts;
    }

    @Post()
    async create(@Body() data: CreateContactDto): Promise<CreateContactResponse> {

        // create record
        const contact = new Contact(data);

        await this.store.save(contact)

        return { contact } ;
    }

    findOne() {}

    update() {}

    remove() {}
}
