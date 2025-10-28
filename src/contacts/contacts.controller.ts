import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { Contact } from './contacts.entity';
import { CreateContactDto, GetContactsDto, UpdateContactDto } from './contacts.dto';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

    constructor(
        private store: StoreService,
    ) {}

    @Get()
    async findAll(@Query() query: GetContactsDto) {

        console.log('query', query)

        const pageIndex = parseInt(query.pageIndex as any);
        const pageSize = parseInt(query.pageSize as any);

        const contacts = await this.store.find(Contact, {
            take: pageSize,
            skip: pageSize*pageIndex,
        });

        return contacts;
    }

    @Post()
    async create(@Body() data: CreateContactDto): Promise<Contact> {
        
        const contact = new Contact(data);

        await this.store.save(contact);

        return contact;
    }

    /**
     * /contacts/33
     */
    @Get(':id')
    async findOne(@Param('id') id: string) {

        console.log('contact id', id)

        const contact = await this.store.findOneBy(Contact, { id: parseInt(id) });

        if(!contact) {
            throw new NotFoundException(`Cotnact for id ${id} not found`);
        }

        return contact;
    }

    @Patch(':id')
    async update(
        @Param('id') id: string, 
        @Body() data: UpdateContactDto
    ) {

        const contact = await this.store.findOneBy(Contact, { id: parseInt(id) });

        if(!contact) {
            throw new NotFoundException(`Cotnact for id ${id} not found`);
        }

        const c = await this.store.update(Contact, data, { id: parseInt(id)});

        return c;
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string, 
    ) {

        const contact = await this.store.findOneBy(Contact, { id: parseInt(id) });

        if(!contact) {
            throw new NotFoundException(`Cotnact for id ${id} not found`);
        }

        const c = await this.store.remove(contact);

        return c;
    }
}
