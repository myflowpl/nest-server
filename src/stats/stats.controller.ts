import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RoleNames } from '../auth/auth.types.js';
import { ApiAuth } from '../auth/decorators/api-auth.decorator.js';
import { StatsService } from './stats.service.js';

@Controller('admin/stats')
@ApiTags('Admin: statystyki')
@ApiAuth(RoleNames.ADMIN)
export class StatsController {
  constructor(private statsService: StatsService) {}

  @Get()
  overview() {
    return this.statsService.overview();
  }
}
