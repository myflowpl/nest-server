import { Body, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
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
    @UsePipes(new ValidationPipe({ 
        transform: true,
        transformOptions: { enableImplicitConversion: true }
    }))
    async findAll(
        @Query() query: GetContactsDto,
        // @Query('pageSize', ParseIntPipe) pageSize: number,
    ): Promise<Contact[]> {

        console.log('query', query)
        
        const contacts = await this.store.find(Contact, {
            take: query.pageSize,
            skip: query.pageSize*query.pageIndex,
        });

        return contacts;
    }

    @Post()
    @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() data: CreateContactDto): Promise<CreateContactResponse> {

        // create record
        const contact = new Contact(data);

        await this.store.save(contact)

        return { contact } ;
    }

    @Get(':id')
    @ApiResponse({status: 404, description: 'Not found error', type: ErrorResponse})
    @UsePipes(ParseIntPipe)
    async findOne(@Param('id') id: number): Promise<Contact> {

        console.log('param', id)

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id: "${id}" not found`);
        }

        return contact;
    }

    @Patch(':id')
    @ApiResponse({status: 404, description: 'Not found error', type: ErrorResponse})
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() data: UpdateContactDto,
    ) {

        console.log('param', id)

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id: "${id}" not found`);
        }

        Object.assign(contact, data);

        await this.store.save(contact);

        // await this.store.update(Contact, data, { id: parseInt(id)})

        return contact;
    }

    @Delete('/remove/:id/active')
    async remove(
        @Param('id', new DefaultValuePipe(0), ParseIntPipe) id: number,
    ): Promise<Contact> {

        console.log('param', id)

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id: "${id}" not found`);
        }

        await this.store.remove(contact);

        return contact;
    }
}

