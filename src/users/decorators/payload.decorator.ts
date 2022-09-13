import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestPayload } from '../entities/user.entity';

export const Payload = createParamDecorator((key: keyof RequestPayload, context: ExecutionContext): RequestPayload | RequestPayload[keyof RequestPayload] => {
  
  const req: Request = context.switchToHttp().getRequest();

  const payload: RequestPayload = req.payload;

  if (payload && key) {
    return payload[key];
  }

  return payload;
});
