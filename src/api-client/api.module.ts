import { DynamicModule, Module, Global } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';
import { Configuration } from './configuration';

import { AppService } from './api/app.service';
import { AuthService } from './api/auth.service';
import { ContactsService } from './api/contacts.service';
import { PhotosService } from './api/photos.service';
import { UsersAdminService } from './api/usersAdmin.service';

@Global()
@Module({
  imports:      [ HttpModule ],
  exports:      [
    AppService,
    AuthService,
    ContactsService,
    PhotosService,
    UsersAdminService
  ],
  providers: [
    AppService,
    AuthService,
    ContactsService,
    PhotosService,
    UsersAdminService
  ]
})
export class ApiModule {
    public static forRoot(configurationFactory: () => Configuration): DynamicModule {
        return {
            module: ApiModule,
            providers: [ { provide: Configuration, useFactory: configurationFactory } ]
        };
    }

    constructor( httpService: HttpService) { }
}
