import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Contact } from './contacts.entity';
import { CreateContactDto, GetContactsDto, HttpExceptionDto } from './contacts.dto';
import { StoreService } from '../store/store.service';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

    constructor(
        private store: StoreService
    ) {}

    @Get()
    async findAll(@Query() query: GetContactsDto) {

        console.log('query', query)

        const contacts = await this.store.find(Contact, {
            take: query.pageSize,
            skip: query.pageSize*query.pageIndex,
        });

        return contacts;
    }

    @Get('active')
    @HttpCode(201)
    findAllActive() {
        return {data: ['jakos tam z controlera']}
    }

    @Post()
    async create(@Body() data: CreateContactDto) {
        
        const contact = new Contact(data);

        await this.store.save(contact);

        return contact;
    }

    @Delete('/remove/:id/active')
    @ApiResponse({status: 404, description: 'Contact not found', type: HttpExceptionDto})
    async delete(@Param('id') id: string ) {

        console.log('id', id)

        const contact = await this.store.findOneBy(Contact, { id: parseInt(id) });

        if(!contact) {
            throw new NotFoundException(`Contact for id "${id}" not found`);
        }

        await this.store.remove(contact);

        return contact;
    }
}
