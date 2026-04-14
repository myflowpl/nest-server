import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';
import { Request } from 'express';
import { fromEvent } from 'rxjs';

export const OnClose = createParamDecorator((key: any = 'user', context: ExecutionContext) => {

    const request: Request = context.switchToHttp().getRequest();

    return fromEvent(request, 'close');

});