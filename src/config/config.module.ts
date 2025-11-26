import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';


export const HTTP_SERVER_URL = "HTTP_SERVER_URL";

@Module({
  providers: [
    ConfigService,
    {
      provide: HTTP_SERVER_URL,
      useValue: "http://localhost:3000",

    }
  ],
  exports: [
    ConfigService,
    HTTP_SERVER_URL,
  ],
})
export class ConfigModule {}
