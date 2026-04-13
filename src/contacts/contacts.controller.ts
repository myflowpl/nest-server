import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateContactDto, CreateContactResponse, ErrorResponse, GetContactsDto, UpdateContactDto } from './contacts.dto';
import { Contact } from './contacts.entity';
import { StoreService } from '../store/store.service';

@Controller('contacts')
@ApiTags("Contacts")
export class ContactsController {

    constructor(
        private store: StoreService,
    ) {}

    @Get()
    async findAll(@Query() query: GetContactsDto): Promise<Contact[]> {

        console.log('query', query)
        
        const contacts = await this.store.find(Contact, {
            take: query.pageSize,
            skip: query.pageSize*query.pageIndex,
        });

        return contacts;
    }

    @Post()
    async create(@Body() data: CreateContactDto): Promise<CreateContactResponse> {

        // create record
        const contact = new Contact(data);

        await this.store.save(contact)

        return { contact } ;
    }

    @Get(':id')
    @ApiResponse({status: 404, description: 'Not found error', type: ErrorResponse})
    async findOne(@Param('id') id: string): Promise<Contact> {

        console.log('param', id)

        const contact = await this.store.findOneBy(Contact, { id: parseInt(id) });

        if(!contact) {
            throw new NotFoundException(`Contact for id: "${id}" not found`);
        }

        return contact;
    }

    @Patch(':id')
    @ApiResponse({status: 404, description: 'Not found error', type: ErrorResponse})
    async update(
        @Param('id') id: string,
        @Body() data: UpdateContactDto,
    ) {

        console.log('param', id)

        const contact = await this.store.findOneBy(Contact, { id: parseInt(id) });

        if(!contact) {
            throw new NotFoundException(`Contact for id: "${id}" not found`);
        }

        Object.assign(contact, data);

        await this.store.save(contact);

        // await this.store.update(Contact, data, { id: parseInt(id)})

        return contact;
    }

    @Delete('/remove/:id/active')
    async remove(@Param('id') id: string): Promise<Contact> {

        console.log('param', id)

        const contact = await this.store.findOneBy(Contact, { id: parseInt(id) });

        if(!contact) {
            throw new NotFoundException(`Contact for id: "${id}" not found`);
        }

        await this.store.remove(contact);

        return contact;
    }
}

