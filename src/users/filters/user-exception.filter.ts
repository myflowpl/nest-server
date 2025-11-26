import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../config';

export class UserBlockedException extends HttpException {

  constructor(reason: string) {
    super(
      {reason, reasonMessage: 'You are blocked'},
      HttpStatus.FORBIDDEN,
    );
  }
}

@Catch(UserBlockedException)
export class UserExceptionFilter<T> implements ExceptionFilter {

  private logger = new Logger('User Exception', {timestamp: true})

  constructor(
    private config: ConfigService,
  ) {}

  catch(exception: UserBlockedException, host: ArgumentsHost) {


    const request: Request = host.switchToHttp().getRequest();
    const response: Response = host.switchToHttp().getResponse();

    const status = exception.getStatus() || 500;
    const userId = request.payload?.user.id || null;

    const data: any = {
      statusCode: status,
      userId,
      path: request.url,
      message: null,
      stack: null,
    };

    if(this.config.DEBUG) {
      data.message = exception.message || null;
      data.stack = exception.stack || null;
    }
    
    this.logger.error(data);
    response.status(status).json(data);
  }
}
