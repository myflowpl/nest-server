import { BadRequestException, Body, ClassSerializerInterceptor, Controller, DefaultValuePipe, Delete, Get, NotFoundException, Param, ParseFilePipe, ParseIntPipe, Patch, Post, Query, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from '../store/store.service';
import { CreateContactDto, GetContactsDto, SortDir, UpdateContactDto } from './contacts.dto';
import { Contact } from './contacts.entity';
import { APP_PIPE } from '@nestjs/core';
@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {

  constructor(
    private store: StoreService,
  ) {}
  
  @Get()
  @UsePipes(new ValidationPipe({
    transform: true, 
    transformOptions: { enableImplicitConversion: true }
  }))
  async findAll(@Query() query: GetContactsDto, @Query('sortDir', new DefaultValuePipe(1)) sortDir: SortDir): Promise<Contact[]> {

    const contacts = await this.store.findAll(Contact);


    console.log(sortDir)
    console.log(query)

    return contacts.slice((query.page-1) * query.pageSize, query.page * query.pageSize)

  }

  @Post()
  async create(@Body(new ValidationPipe({})) data: CreateContactDto): Promise<Contact> {

    const existingEmail = await this.store.findAll(Contact).then(
      contacts => contacts.find(contact => contact.email === data.email)
    )

    if(existingEmail) {
      throw new BadRequestException(`Email ${data.email} jest już zajęty`)
    }

    const contact = await this.store.create(Contact, data);

    return contact;
  }

  @Get(':id')
  @UseInterceptors(ClassSerializerInterceptor)
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Contact> {

    const contact = await this.store.findOne(Contact, id);

    if(!contact) {
      throw new NotFoundException(`Contact by id ${id} not found`)
    }

    return contact;
  }

  @Patch(':id')
  async update(@Param('id', ParseFilePipe) id: string, @Body() data: UpdateContactDto): Promise<Contact> {

    const contact = await this.store.update(Contact, +id, data);

    if(!contact) {
      throw new NotFoundException(`Contact by id ${id} not found`)
    }

    return contact;
  }

  @Delete(':id')
  @UsePipes(ParseIntPipe)
  async remove(@Param('id') id: number): Promise<number> {
    
    const contact = await this.store.remove(Contact, id);

    if(!contact) {
      throw new NotFoundException(`Contact by id ${id} not found`)
    }

    return contact;
  }
}
