import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import { RequestPayload } from '../entities/user.entity.js';

export const Auth = createParamDecorator((key: keyof RequestPayload, context: ExecutionContext): RequestPayload[keyof RequestPayload] => {

  const request: Request = context.switchToHttp().getRequest();

  const payload: RequestPayload = request.payload;

  key = key || 'user';

  if (payload && key) {
    return payload[key];
  }

  return undefined;
});
