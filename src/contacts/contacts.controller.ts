import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, Render, UsePipes, ValidationPipe } from '@nestjs/common';
import { StoreService } from '../store/store.service.js';
import { Contact } from './contacts.entity.js';
import { CreateContactDto, ErrorResponse, GetContactsDto, UpdateContactDto } from './contacts.dto.js';
import { ApiResponse } from '@nestjs/swagger';

@Controller('contacts')
export class ContactsController {

    constructor(
        private store: StoreService,
    ) {}

    @Get()
    @UsePipes(
        new ValidationPipe({ transform: true,  transformOptions: {enableImplicitConversion: true}}),
    )
    async findAll(@Query() query: GetContactsDto ) {

        console.log('query', query)

        const contacts = await this.store.find(Contact, {
            take: query.pageSize,
            skip: query.pageSize*query.pageIndex,
        });

        return contacts;
    }

    @Post()
    @UsePipes(
        new ValidationPipe({ transform: true,  transformOptions: {enableImplicitConversion: true}}),
    )
    async create( @Body() data: CreateContactDto): Promise<Contact> {

        console.dir(data);

        const contact = new Contact(data);

        await this.store.save(contact);

        return contact;
    }

    @Get(':id')
    @ApiResponse({status: 404, type: ErrorResponse, description: 'Contact not found'})
    async findOne( @Param('id', ParseIntPipe) id: number ) {

        console.dir(id)

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id ${id} not found`)
        }

        return contact;
    }

    @Patch(':id')
    @ApiResponse({status: 404, type: ErrorResponse, description: 'Contact not found'})
    async update( @Param('id', ParseIntPipe) id: number, @Body() data: UpdateContactDto ) {

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id ${id} not found`)
        }

        const c = await this.store.update(Contact, data, { id })

        return c;
    }

    @Delete(':id')
    async remove( @Param('id', ParseIntPipe) id: number) {


        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id ${id} not found`)
        }

        const c = await this.store.remove(contact)

        return c;
    }
}
