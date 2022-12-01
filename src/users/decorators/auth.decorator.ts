import { createParamDecorator, ExecutionContext, SetMetadata, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { RequestPayload, User } from '../entities/user.entity/user.entity';
import { PAYLOAD_KEY } from '../guards/jwt-auth.guard';

export const Auth = createParamDecorator((data: unknown, context: ExecutionContext): User => {

  // get access to request
  const request: Request = context.switchToHttp().getRequest();

  // extract payload
  const payload = request[PAYLOAD_KEY];

  if(!payload?.user) {
    throw new UnauthorizedException(`auth quard required on this method`)
  }

  // return user or null
  return payload.user;
});
