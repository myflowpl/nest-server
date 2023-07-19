import { ArgumentsHost, BadRequestException, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { ExceptionResponse } from '../entities/user.entity';

@Catch(QueryFailedError)
export class EmailExistsFilter<T> implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {

    const res: Response = host.switchToHttp().getResponse();

    console.log(exception);

    const data: ExceptionResponse = {
      message: 'Email already taken',
      error: 'BadRequest',
      statusCode: 400,
    }

    res.status(400).json(data);
    
  }
}
