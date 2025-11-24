import { Controller, Get, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Contact } from './contacts.entity';

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
}
