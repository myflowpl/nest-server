import { Body, Controller, Delete, Get, HttpCode, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Contact } from './contacts.entity';
import { CreateContactDto } from './contacts.dto';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

    @Get()
    findAll() {
        return [
            new Contact({name: 'Piotr'})
        ]
    }

    @Get('active')
    @HttpCode(201)
    findAllActive() {
        return {data: ['jakos tam z controlera']}
    }

    @Post()
    create(@Body() data: CreateContactDto) {
        
        console.log('data', data)

        return true;
    }

    @Delete()
    delete() {

    }
}
