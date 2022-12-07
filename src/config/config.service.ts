import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {

  DEBUG = true;
  PORT = 3000;

}
