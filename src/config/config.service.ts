import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {

  readonly PORT = 3000;

}
