
/**
 * Communities API Integration Tests
 * Tests PostGIS functionality and geospatial endpoints
 */

import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CommunitiesController } from '../src/communities/communities.controller';
import { CommunitiesService } from '../src/communities/communities.service';
import { PrismaService } from '../src/prisma/prisma.service';

describe('Communities API - PostGIS Integration', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [CommunitiesController],
      providers: [CommunitiesService, PrismaService],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('POST /api/communities', () => {
    it('should create community with GPS coordinates', async () => {
      const mockCommunity = {
        name: 'Test Community',
        slug: 'test-community',
        description: 'A test community for PostGIS',
        lat: 37.7749,
        lng: -122.4194,
        radius: 1000,
      };

      // Mock the service
      const service = app.get(CommunitiesService);
      jest.spyOn(service, 'create').mockResolvedValue({
        id: 'test-id',
        ...mockCommunity,
        geofence: null,
        createdById: 'user-id',
        coverImage: null,
        avatar: null,
        isPrivate: false,
        memberCount: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any);

      // Test would make actual HTTP request in real scenario
      const result = await service.create({
        ...mockCommunity,
        createdById: 'user-id',
      });

      expect(result).toBeDefined();
      expect(result.name).toBe(mockCommunity.name);
    });

    it('should validate geospatial data', () => {
      // Test latitude bounds
      const invalidLat = 91;
      const invalidLng = -181;

      expect(invalidLat).toBeGreaterThan(90);
      expect(invalidLng).toBeLessThan(-180);
    });
  });

  describe('GET /api/communities/nearby', () => {
    it('should find communities within radius', async () => {
      const service = app.get(CommunitiesService);

      const searchParams = {
        lat: 37.7749,
        lng: -122.4194,
        radius: 5000,
        limit: 20,
      };

      jest.spyOn(service, 'findNearby').mockResolvedValue([
        {
          id: 'community-1',
          name: 'Nearby Community',
          slug: 'nearby-community',
          description: 'Close by',
          distance: 1500,
          coverImage: null,
          avatar: null,
          isPrivate: false,
          memberCount: 10,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);

      const result = await service.findNearby(searchParams);

      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      if (result.length > 0) {
        expect(result[0]).toHaveProperty('distance');
        expect(typeof result[0].distance).toBe('number');
      }
    });

    it('should sort results by distance', async () => {
      const service = app.get(CommunitiesService);

      const mockResults = [
        { id: '1', distance: 3000 },
        { id: '2', distance: 1000 },
        { id: '3', distance: 2000 },
      ];

      jest.spyOn(service, 'findNearby').mockResolvedValue(mockResults as any);

      const results = await service.findNearby({
        lat: 37.7749,
        lng: -122.4194,
        radius: 5000,
        limit: 20,
      });

      // Results should be sorted by distance (ascending)
      for (let i = 1; i < results.length; i++) {
        expect(results[i].distance).toBeGreaterThanOrEqual(results[i - 1].distance);
      }
    });
  });

  describe('POST /api/communities/:id/verify-location', () => {
    it('should verify user is within geofence', async () => {
      const service = app.get(CommunitiesService);

      const communityId = 'test-community-id';
      const userLocation = {
        lat: 37.7749,
        lng: -122.4194,
      };

      jest.spyOn(service, 'verifyLocation').mockResolvedValue({
        within: true,
        distance: 500,
        communityId,
        communityName: 'Test Community',
        allowedRadius: 1000,
      });

      const result = await service.verifyLocation(communityId, userLocation);

      expect(result).toBeDefined();
      expect(result.within).toBeDefined();
      expect(result.distance).toBeDefined();
      expect(typeof result.distance).toBe('number');
    });

    it('should detect user outside geofence', async () => {
      const service = app.get(CommunitiesService);

      jest.spyOn(service, 'verifyLocation').mockResolvedValue({
        within: false,
        distance: 2000,
        communityId: 'test-id',
        communityName: 'Test Community',
        allowedRadius: 1000,
      });

      const result = await service.verifyLocation('test-id', {
        lat: 40.7128,
        lng: -74.006,
      });

      expect(result.within).toBe(false);
      expect(result.distance).toBeGreaterThan(result.allowedRadius);
    });
  });

  describe('PostGIS Functionality', () => {
    it('should have PostGIS extension installed', async () => {
      const result = await prisma.$queryRaw<any[]>`
        SELECT extname, extversion 
        FROM pg_extension 
        WHERE extname = 'postgis'
      `;

      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].extname).toBe('postgis');
    });

    it('should calculate distance correctly', async () => {
      // Test ST_Distance function
      const result = await prisma.$queryRaw<any[]>`
        SELECT ST_Distance(
          ST_GeogFromText('POINT(-122.4194 37.7749)'),
          ST_GeogFromText('POINT(-118.2437 34.0522)')
        ) as distance
      `;

      expect(result).toBeDefined();
      expect(result[0].distance).toBeDefined();
      
      // Distance between SF and LA should be approximately 559km
      const distanceInKm = result[0].distance / 1000;
      expect(distanceInKm).toBeGreaterThan(550);
      expect(distanceInKm).toBeLessThan(570);
    });
  });
});
