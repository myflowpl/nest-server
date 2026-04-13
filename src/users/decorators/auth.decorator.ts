import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { RequestPayload } from '../entities/user.entity';
import { Request } from 'express';

export const Auth = createParamDecorator((key: keyof RequestPayload = 'user', context: ExecutionContext) => {

    const request: Request = context.switchToHttp().getRequest();

    const payload = request.payload;

    return payload ? payload[key] : undefined;

});
