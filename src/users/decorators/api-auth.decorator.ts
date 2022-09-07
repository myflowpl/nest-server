import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { Roles } from './roles.decorator';

export function ApiAuth(...roles: string[]) {
  return applyDecorators(
    Roles(...roles),
    UseGuards(),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'api bearer auth requred'})
  );
}