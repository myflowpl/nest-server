import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {

  readonly DEBUG = true;
  readonly PORT = 3000;
  
}
