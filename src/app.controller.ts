import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { StoreService } from './store/store.service';
import { ContactsApi } from './api-client-nest';

@Controller()
@ApiTags('App')
export class AppController {

  constructor(
    private readonly appService: AppService,
    private store: StoreService,
    private api: ContactsApi
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
    
  }

  @Get('test-nest-api')
  testNestApi() {
    
    // return this.api.contactsControllerFindAll(0, 2, 'email', 'asc');

    return this.api.contactsControllerFindAll({
      pageIndex: 0,
      pageSize: 2,
      
    });
    
  }
}
