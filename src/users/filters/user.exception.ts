import { HttpException, HttpStatus } from "@nestjs/common";

export enum UserBlockReason {
  QUOTA,
  PAYMENT
}
export class UserBlockedException extends HttpException {
  constructor(reason: UserBlockReason) {
    super({ reason, reasonMessage: 'You are blocked and your access is forbidden now' }, HttpStatus.FORBIDDEN);
  }
}
