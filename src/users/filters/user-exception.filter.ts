import { ArgumentsHost, Catch, ExceptionFilter, UnprocessableEntityException } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '../../config';


@Catch(UnprocessableEntityException)
export class UserExceptionFilter<UnprocessableEntityException> implements ExceptionFilter {

  constructor(
    private config: ConfigService,
  ) {}

  catch(exception: UnprocessableEntityException, host: ArgumentsHost) {


    const response: Response = host.switchToHttp().getResponse();

    response.status(444).send('ERROR BY USER EXCEPTION: ' + exception)

  }
}
