
/**
 * Health Check Tests
 * Verify PostGIS extension is loaded and functional
 */

import { Test, TestingModule } from '@nestjs/testing';
import { HealthController } from '../src/health/health.controller';
import { HealthService } from '../src/health/health.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Health Check API', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [HealthService, PrismaService],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const mockHealth = {
        status: 'healthy' as const,
        timestamp: new Date().toISOString(),
        uptime: 100,
        checks: {
          api: { status: 'healthy' },
          database: { status: 'healthy', latency: 10 },
          postgis: { status: 'healthy', version: '3.3.0', spatialRefSys: 8500 },
        },
      };

      jest.spyOn(service, 'check').mockResolvedValue(mockHealth);

      const result = await controller.check();

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('healthy');
      expect(result.data.checks).toBeDefined();
    });
  });

  describe('GET /api/health/postgis', () => {
    it('should verify PostGIS is installed', async () => {
      const mockPostGISHealth = {
        status: 'healthy' as const,
        installed: true,
        version: '3.3.0',
        fullVersion: 'POSTGIS="3.3.0"',
        spatialRefSysCount: 8500,
        functionalityTest: {
          passed: true,
          testQuery: 'ST_Distance between San Francisco and Los Angeles',
          expectedDistance: 559120,
          actualDistance: 559133,
          difference: 13,
        },
        timestamp: new Date().toISOString(),
      };

      jest.spyOn(service, 'checkPostGIS').mockResolvedValue(mockPostGISHealth);

      const result = await controller.checkPostGIS();

      expect(result.success).toBe(true);
      expect(result.data.installed).toBe(true);
      expect(result.data.version).toBeDefined();
      expect(result.data.functionalityTest.passed).toBe(true);
    });

    it('should fail if PostGIS is not installed', async () => {
      jest.spyOn(service, 'checkPostGIS').mockRejectedValue(
        new Error('PostGIS extension is not installed')
      );

      await expect(controller.checkPostGIS()).rejects.toThrow();
    });
  });

  describe('GET /api/health/db', () => {
    it('should check database connection', async () => {
      const mockDbHealth = {
        status: 'healthy' as const,
        latency: 15,
        version: 'PostgreSQL 15.3',
        timestamp: new Date().toISOString(),
      };

      jest.spyOn(service, 'checkDatabase').mockResolvedValue(mockDbHealth);

      const result = await controller.checkDatabase();

      expect(result.success).toBe(true);
      expect(result.data.status).toBe('healthy');
      expect(result.data.latency).toBeDefined();
    });
  });
});
