import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiAuth } from '../auth/decorators/api-auth.decorator.js';
import { AuditQueryDto } from './audit.dto.js';
import { AuditService } from './audit.service.js';

@Controller('admin/audit')
@ApiTags('Admin: audyt')
@ApiAuth()
export class AuditController {
  constructor(private auditService: AuditService) {}

  @Get()
  list(@Query() query: AuditQueryDto) {
    return this.auditService.list(query);
  }
}
