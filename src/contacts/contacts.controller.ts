import { Body, Controller, DefaultValuePipe, Delete, Get, Inject, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { Contact } from './contacts.entity';
import { CreateContactDto, GetContactsDto, UpdateContactDto } from './contacts.dto';
import { JwtService } from '@nestjs/jwt';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

    constructor(
        private store: StoreService,
        private jwt: JwtService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
    ) {}

    @Get()
    @UsePipes(new ValidationPipe({
        transform: true,
        transformOptions: { enableImplicitConversion: true }
    }))
    @UseInterceptors(CacheInterceptor)
    async findAll( @Query() query: GetContactsDto) {

        console.log('query', query)

        const pageSize = parseInt(query.pageSize as any);

        const contacts = await this.store.find(Contact, {
            take: query.pageSize,
            skip: query.pageSize*query.pageIndex,
        });

        return contacts;
    }

    @Post()
    @UsePipes(new ValidationPipe({transform: true}))
    async create(@Body() data: CreateContactDto): Promise<Contact> {
        
        const contact = new Contact(data);

        await this.store.save(contact);

        return contact;
    }

    /**
     * /contacts/33
     */
    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: number) {

        const key = 'contact'+id;
        const record  = await this.cacheManager.get(key);

        if(record) {
            console.log('from cache', )
            return record;
        }

        console.log('contact id', id)

        const contact = await this.store.findOneBy(Contact, { id });

        if(!contact) {
            throw new NotFoundException(`Cotnact for id ${id} not found`);
        }

        await this.cacheManager.set(key, contact);

        return contact;
    }

    @Patch(':id')
    async update(
        @Param('id', new ParseIntPipe()) id: string, 
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
    @UsePipes(ParseIntPipe)
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
