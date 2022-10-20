import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../entities/user.entity';

export const Auth = createParamDecorator((data: unknown, context: ExecutionContext): User | undefined => {

  const request: Request = context.switchToHttp().getRequest();

  const payload = request.payload;

  return payload ? payload.user : undefined;
});
