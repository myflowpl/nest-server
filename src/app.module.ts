import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { StoreModule } from './store/store.module';
import { ConfigModule } from './config/config.module';
import { ContactsModule } from './contacts/contacts.module';
import { UsersModule } from './users/users.module';
import { Configuration, ApiModule } from './api-client';
import { ConfigService } from './config';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    StoreModule, 
    ConfigModule, 
    ContactsModule, 
    UsersModule,

    ApiModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {

        return new Configuration({ 
          basePath: config.DOMAIN,

         });

      }
    }),

    PrismaModule

  ],
  controllers: [AppController],
  providers: [
    AppService, 
    
    // // {
    //   provide: ContactsApi,
    //   inject: [ConfigService],
    //   useFactory: (config: ConfigService) => {

    //     const options = new Configuration({ 
    //       basePath: config.DOMAIN,

    //      });

    //     return new ContactsApi(options);
    //   }
    // }
  ],
})
export class AppModule {}
