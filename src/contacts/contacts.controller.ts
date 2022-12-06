import { Body, Controller, Get, Headers, Param, Post, Query, NotFoundException, HttpException, HttpStatus, Delete, Patch, ParseIntPipe, UsePipes, ValidationPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, ErrorResponse, GetContactsDto, UpdateContactsDto } from './contact.dto';
import { Contact } from './contact.entity';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}

  @Get()
  @UsePipes(new ValidationPipe({transform: true, transformOptions: {enableImplicitConversion: true}}))
  async findAll(@Query() query: GetContactsDto) {

    const contacts = await this.store.find(Contact, {
      take: query.pageSize, 
      skip: query.pageSize*query.pageIndex
    });

    return contacts;
  }

  @Post()
  async create(@Body() data: CreateContactDto) {

    const contact = new Contact(data);

    await this.store.save(contact);

    return contact;
  }

  @Get(':id')
  @UsePipes(ParseIntPipe)
  async findOne(@Param('id') id: number) {

    const contact = await this.store.findOneBy(Contact, {id});

    if(!contact) {
      throw new HttpException(`Contact for id ${id} was not found`, HttpStatus.NOT_FOUND);
      // throw new NotFoundException(`Contact for id ${id} was not found`);
    }

    return contact;
  }

  @Delete(':id')
  @UsePipes(ParseIntPipe)
  async remove(@Param('id') id: number) {
    
    const contact = await this.store.findOneBy(Contact, {id});

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} was not found`);
    }

    const c = await this.store.remove(contact);

    return 'removed successfully';
  }

  @Patch(':id')
  @ApiResponse({status: 404, type: ErrorResponse, description: `Contact not found`})
  async update(
    @Param('id', new DefaultValuePipe(0), ParseIntPipe) id: number, 
    @Body( new ValidationPipe({whitelist: true, forbidNonWhitelisted: true})) data: UpdateContactsDto,
  ): Promise<Contact> {

    let contact = await this.store.findOneBy(Contact, {id});

    if(!contact) {
      throw new NotFoundException(`Contact for id ${id} was not found`);
    }

    const c = await this.store.update(Contact, data, {id});

    return c;
  }
}
