import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
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
    @UsePipes(new ValidationPipe({
        transform: true, 
        transformOptions: { enableImplicitConversion: true }
    }))
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
    @UsePipes( ValidationPipe )
    async create(@Body() data: CreateContactDto) {
        
        const contact = new Contact(data);

        await this.store.save(contact);

        return contact;
    }

    @Patch(':id')
    @ApiResponse({status: 404, description: 'Contact not found', type: HttpExceptionDto})
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body(ValidationPipe ) data: CreateContactDto,
    ) {

        console.log('id', id)

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id "${id}" not found`);
        }

        await this.store.update(Contact, data, {id});

        return contact;
    }

    @Delete('/remove/:id/active')
    @ApiResponse({status: 404, description: 'Contact not found', type: HttpExceptionDto})
    async delete(@Param('id', ParseIntPipe) id: number ) {

        console.log('id', id)

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id "${id}" not found`);
        }

        await this.store.remove(contact);

        return contact;
    }
}
