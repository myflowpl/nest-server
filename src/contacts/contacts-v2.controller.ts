import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller('v2/contacts')
@ApiTags("Contacts")
export class ContactsV2Controller {

    @Get()
    findAll() {
        return ['record 1 v2'];
    }

}
