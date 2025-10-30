import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { RequestPayload } from '../entities/user.entity';

export const authDecoratorFactory = (key: keyof RequestPayload = 'user', context: ExecutionContext): RequestPayload[keyof RequestPayload] => {

    const request: Request = context.switchToHttp().getRequest();

    const payload = request.payload;

    return payload ? payload[key] : undefined;
};

export const Auth = createParamDecorator(authDecoratorFactory);

