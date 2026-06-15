
import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { HealthService } from './health.service';

@Controller('health')
export class HealthController {
  constructor(private healthService: HealthService) {}

  /**
   * GET /health/live
   * Process liveness check for deployment platforms.
   */
  @Get('live')
  checkLive() {
    return {
      success: true,
      data: this.healthService.checkLive(),
    };
  }

  /**
   * GET /health/ready
   * Readiness check for dependencies required by the API.
   */
  @Get('ready')
  async checkReady() {
    const health = await this.healthService.check();

    if (health.status !== 'healthy') {
      throw new ServiceUnavailableException({
        success: false,
        data: health,
      });
    }

    return {
      success: true,
      data: health,
    };
  }

  /**
   * GET /health
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
   * GET /health/postgis
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
   * GET /health/db
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
