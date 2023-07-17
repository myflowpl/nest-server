import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
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
    @UsePipes(
        new ValidationPipe({
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        })
    )
    async findAll(@Query() query: GetContactsDto): Promise<Contact[]> {

        console.log(query, query.pageSize * query.pageIndex)

        const contacts = await this.store.find(Contact, {
            take: query.pageSize,
            skip: query.pageSize*query.pageIndex,
        });

        return contacts;
    }

    @Post()
    @UsePipes(ValidationPipe)
    async create(@Body() data: CreateContactDto): Promise<Contact> {

        const contact = new Contact(data);

        await this.store.save(contact);

        return contact;
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number): Promise<Contact> {

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id ${id} not found`);
        }

        return contact;
    }

    @Delete(':id')
    @UsePipes(ParseIntPipe)
    async remove(@Param('id') id: number): Promise<Contact> {

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id ${id} not found`);
        }

        await this.store.remove(contact);

        return contact;
    }

    @Patch(':id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateContactDto): Promise<Contact> {

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Contact for id ${id} not found`);
        }

        const c = await this.store.update(Contact, data, { id });

        return c;
    }
}
