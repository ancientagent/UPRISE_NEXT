
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  checks: {
    api: { status: string };
    database?: { status: string; latency?: number; error?: string };
    postgis?: {
      status: string;
      version?: string;
      spatialRefSys?: number;
      error?: string;
    };
  };
}

@Injectable()
export class HealthService {
  constructor(private prisma: PrismaService) {}

  /**
   * Overall health check
   */
  async check(): Promise<HealthStatus> {
    const startTime = Date.now();

    const checks: HealthStatus['checks'] = {
      api: { status: 'healthy' },
    };

    // Check database
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const dbLatency = Date.now() - dbStart;
      checks.database = { status: 'healthy', latency: dbLatency };
    } catch (error) {
      checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Check PostGIS
    try {
      const postgisInfo = await this.checkPostGISInternal();
      checks.postgis = {
        status: 'healthy',
        version: postgisInfo.version,
        spatialRefSys: postgisInfo.spatialRefSysCount,
      };
    } catch (error) {
      checks.postgis = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }

    // Determine overall status
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';
    if (checks.database?.status === 'unhealthy' || checks.postgis?.status === 'unhealthy') {
      status = 'unhealthy';
    } else if (checks.database?.status === 'degraded' || checks.postgis?.status === 'degraded') {
      status = 'degraded';
    }

    return {
      status,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      checks,
    };
  }

  /**
   * Check database connection
   */
  async checkDatabase() {
    try {
      const startTime = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - startTime;

      // Get database version
      const versionResult = await this.prisma.$queryRaw<Array<{ version: string }>>`
        SELECT version() as version
      `;

      return {
        status: 'healthy',
        latency,
        version: versionResult[0]?.version,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Check PostGIS extension
   */
  async checkPostGIS() {
    try {
      const info = await this.checkPostGISInternal();

      // Test PostGIS functionality with a simple spatial query
      const testResult = await this.prisma.$queryRaw<Array<{ distance: number }>>`
        SELECT ST_Distance(
          ST_GeogFromText('POINT(-122.4194 37.7749)'),
          ST_GeogFromText('POINT(-118.2437 34.0522)')
        ) as distance
      `;

      const expectedDistance = 559120; // Approximate distance between SF and LA in meters
      const actualDistance = testResult[0]?.distance || 0;
      const distanceDiff = Math.abs(actualDistance - expectedDistance);
      const isAccurate = distanceDiff < 1000; // Within 1km tolerance

      return {
        status: 'healthy',
        installed: true,
        version: info.version,
        fullVersion: info.fullVersion,
        spatialRefSysCount: info.spatialRefSysCount,
        functionalityTest: {
          passed: isAccurate,
          testQuery: 'ST_Distance between San Francisco and Los Angeles',
          expectedDistance,
          actualDistance: Math.round(actualDistance),
          difference: Math.round(distanceDiff),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new InternalServerErrorException({
        status: 'unhealthy',
        installed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'PostGIS extension is not installed or not functioning correctly',
        timestamp: new Date().toISOString(),
      });
    }
  }

  /**
   * Internal method to check PostGIS
   */
  private async checkPostGISInternal() {
    // Check if PostGIS extension is installed
    const extensionCheck = await this.prisma.$queryRaw<
      Array<{ extname: string; extversion: string }>
    >`
      SELECT extname, extversion 
      FROM pg_extension 
      WHERE extname = 'postgis'
    `;

    if (!extensionCheck || extensionCheck.length === 0) {
      throw new Error('PostGIS extension is not installed');
    }

    // Get PostGIS version
    const versionResult = await this.prisma.$queryRaw<
      Array<{ version: string; full_version: string }>
    >`
      SELECT 
        PostGIS_Version() as version,
        PostGIS_Full_Version() as full_version
    `;

    // Get count of spatial reference systems
    const srsCount = await this.prisma.$queryRaw<Array<{ count: bigint }>>`
      SELECT COUNT(*) as count FROM spatial_ref_sys
    `;

    return {
      version: versionResult[0]?.version || 'unknown',
      fullVersion: versionResult[0]?.full_version || 'unknown',
      spatialRefSysCount: Number(srsCount[0]?.count || 0),
    };
  }
}
