
import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  /**
   * GET /api/health
   * Basic health check
   */
  @Get()
  async check() {
    const health = await this.healthService.check();
    return {
      success: true,
      data: health,
    };
  }

  /**
   * GET /api/health/postgis
   * Verify PostGIS extension is loaded and functional
   */
  @Get('postgis')
  async checkPostGIS() {
    const postgisHealth = await this.healthService.checkPostGIS();
    return {
      success: true,
      data: postgisHealth,
    };
  }

  /**
   * GET /api/health/db
   * Check database connection
   */
  @Get('db')
  async checkDatabase() {
    const dbHealth = await this.healthService.checkDatabase();
    return {
      success: true,
      data: dbHealth,
    };
  }
}
