import { ArgumentsHost, Catch, ExceptionFilter, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ConfigService } from '../../config';
import { UserBlockedException } from './user.exception';

@Catch(UserBlockedException)
export class UserExceptionFilter implements ExceptionFilter {
  
  private logger = new Logger('Users Exception Filter', { timestamp: true });

  constructor(private config: ConfigService) {}

  catch(exception: any, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const res: Response = ctx.getResponse();
    const req: Request = ctx.getRequest();
    const status = exception.status || 500;
    const userId = req.payload?.user.id || null;

    const data = {
      statusCode: status,
      userId,
      path: req.url,
      errorStack: this.config.DEBUG ? exception.stack : null,
      errorMessage: this.config.DEBUG ? exception.message : null,
    };

    this.logger.error(data);

    res.status(status).json(data);
  }
}
