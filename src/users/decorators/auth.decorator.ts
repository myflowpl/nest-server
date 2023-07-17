import { ExecutionContext, createParamDecorator } from "@nestjs/common";
import { Request } from "express";
import { RequestPayload } from "../entities/user.entity";

export const Auth = createParamDecorator((key: keyof RequestPayload = 'user', context: ExecutionContext): RequestPayload[keyof RequestPayload] => {

    // get request instance
    const request: Request = context.switchToHttp().getRequest();

    const payload = request.payload;

    return payload ? payload[key] : undefined;
});