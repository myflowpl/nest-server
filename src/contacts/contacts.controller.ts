import { Body, Controller, Get, Post } from '@nestjs/common';
import { StoreService } from '../store/store.service.js';
import { Contact } from './contacts.entity.js';
import { CreateContactDto } from './contacts.dto.js';

@Controller('contacts')
export class ContactsController {

    constructor(
        private store: StoreService,
    ) {}

    @Get()
    async findAll() {

        const contacts = await this.store.find(Contact, {});

        return contacts;
    }

    @Post()
    create( @Body() data: CreateContactDto) {

        console.log('create data', data);

        return data;
    }

    findOne() {}

    update() {}

    remove() {}
}
