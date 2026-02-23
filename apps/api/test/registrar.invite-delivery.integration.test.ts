import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/prisma/prisma.service';
import { RegistrarService } from '../src/registrar/registrar.service';

describe('Registrar Invite Delivery Lifecycle Integration', () => {
  let prisma: PrismaService;
  let registrarService: RegistrarService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService, RegistrarService],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
    registrarService = module.get<RegistrarService>(RegistrarService);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('persists queued invite deliveries and surfaces sent/failed outcomes in invite status read', async () => {
    const suffix = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    let submitterId: string | null = null;
    let sceneId: string | null = null;
    let registrarEntryId: string | null = null;

    try {
      const submitter = await prisma.user.create({
        data: {
          email: `registrar_submitter_${suffix}@uprise.local`,
          username: `registrar_submitter_${suffix}`,
          displayName: 'Registrar Submitter',
          password: 'test-password-hash',
          gpsVerified: true,
          homeSceneCity: 'Austin',
          homeSceneState: 'TX',
          homeSceneCommunity: 'punk',
        },
      });
      submitterId = submitter.id;

      const scene = await prisma.community.create({
        data: {
          name: `Austin Punk ${suffix}`,
          slug: `austin-punk-${suffix}`,
          description: 'Integration test scene',
          createdById: submitter.id,
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
          tier: 'city',
        },
      });
      sceneId = scene.id;

      const submitted = await registrarService.submitArtistBandRegistration(submitter.id, {
        sceneId: scene.id,
        name: 'Static Signal',
        slug: `static-signal-${suffix}`,
        entityType: 'band',
        members: [
          {
            name: 'Sam Pulse',
            email: `sam_${suffix}@example.com`,
            city: 'Austin',
            instrument: 'Drums',
          },
          {
            name: 'Alex Volt',
            email: `alex_${suffix}@example.com`,
            city: 'Austin',
            instrument: 'Guitar',
          },
        ],
      });
      registrarEntryId = submitted.id;

      const dispatched = await registrarService.dispatchArtistBandInvites(submitter.id, submitted.id, {
        mobileAppUrl: 'https://m.uprise.example/download',
        webAppUrl: 'https://uprise.example/band',
      });
      expect(dispatched.queuedCount).toBe(2);

      const queuedMembers = await prisma.registrarArtistMember.findMany({
        where: {
          registrarEntryId: submitted.id,
        },
        select: {
          id: true,
          inviteStatus: true,
        },
        orderBy: { createdAt: 'asc' },
      });
      expect(queuedMembers).toHaveLength(2);
      expect(queuedMembers.every((member) => member.inviteStatus === 'queued')).toBe(true);

      await registrarService.finalizeQueuedInviteDelivery(queuedMembers[0].id, 'sent');
      await registrarService.finalizeQueuedInviteDelivery(queuedMembers[1].id, 'failed');

      const status = await registrarService.getArtistBandInviteStatus(submitter.id, submitted.id);

      expect(status.totalMembers).toBe(2);
      expect(status.countsByStatus.sent).toBe(1);
      expect(status.countsByStatus.failed).toBe(1);

      const sentMember = status.members.find((member: any) => member.id === queuedMembers[0].id);
      expect(sentMember).toBeDefined();
      expect(sentMember.deliveryStatus).toBe('sent');
      expect(sentMember.sentAt).toBeInstanceOf(Date);
      expect(sentMember.failedAt).toBeNull();

      const failedMember = status.members.find((member: any) => member.id === queuedMembers[1].id);
      expect(failedMember).toBeDefined();
      expect(failedMember.deliveryStatus).toBe('failed');
      expect(failedMember.failedAt).toBeInstanceOf(Date);
      expect(failedMember.sentAt).toBeNull();
    } finally {
      if (registrarEntryId) {
        await prisma.registrarInviteDelivery.deleteMany({
          where: {
            registrarArtistMember: {
              registrarEntryId,
            },
          },
        });

        await prisma.registrarArtistMember.deleteMany({
          where: { registrarEntryId },
        });

        await prisma.registrarEntry.deleteMany({
          where: { id: registrarEntryId },
        });
      }

      if (sceneId) {
        await prisma.community.deleteMany({
          where: { id: sceneId },
        });
      }

      if (submitterId) {
        await prisma.user.deleteMany({
          where: { id: submitterId },
        });
      }
    }
  });

  it('preserves finalized invite status on replay finalize attempts', async () => {
    const suffix = `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

    let submitterId: string | null = null;
    let sceneId: string | null = null;
    let registrarEntryId: string | null = null;

    try {
      const submitter = await prisma.user.create({
        data: {
          email: `registrar_replay_submitter_${suffix}@uprise.local`,
          username: `registrar_replay_submitter_${suffix}`,
          displayName: 'Registrar Replay Submitter',
          password: 'test-password-hash',
          gpsVerified: true,
          homeSceneCity: 'Austin',
          homeSceneState: 'TX',
          homeSceneCommunity: 'punk',
        },
      });
      submitterId = submitter.id;

      const scene = await prisma.community.create({
        data: {
          name: `Austin Punk Replay ${suffix}`,
          slug: `austin-punk-replay-${suffix}`,
          description: 'Integration test replay scene',
          createdById: submitter.id,
          city: 'Austin',
          state: 'TX',
          musicCommunity: 'punk',
          tier: 'city',
        },
      });
      sceneId = scene.id;

      const submitted = await registrarService.submitArtistBandRegistration(submitter.id, {
        sceneId: scene.id,
        name: 'Replay Signal',
        slug: `replay-signal-${suffix}`,
        entityType: 'band',
        members: [
          {
            name: 'Replay Drummer',
            email: `replay_${suffix}@example.com`,
            city: 'Austin',
            instrument: 'Drums',
          },
        ],
      });
      registrarEntryId = submitted.id;

      const dispatched = await registrarService.dispatchArtistBandInvites(submitter.id, submitted.id, {
        mobileAppUrl: 'https://m.uprise.example/download',
        webAppUrl: 'https://uprise.example/band',
      });
      expect(dispatched.queuedCount).toBe(1);

      const queuedMember = await prisma.registrarArtistMember.findFirstOrThrow({
        where: { registrarEntryId: submitted.id },
        select: { id: true },
      });

      const firstFinalize = await registrarService.finalizeQueuedInviteDelivery(queuedMember.id, 'sent');
      expect(firstFinalize.deliveryStatus).toBe('sent');
      expect(firstFinalize.alreadyFinalized).toBe(false);
      expect(firstFinalize.dispatchedAt).toBeInstanceOf(Date);

      const replayFinalize = await registrarService.finalizeQueuedInviteDelivery(queuedMember.id, 'failed');
      expect(replayFinalize.deliveryStatus).toBe('sent');
      expect(replayFinalize.alreadyFinalized).toBe(true);
      expect(replayFinalize.dispatchedAt).toEqual(firstFinalize.dispatchedAt);

      const persistedDelivery = await prisma.registrarInviteDelivery.findUniqueOrThrow({
        where: { registrarArtistMemberId: queuedMember.id },
        select: {
          status: true,
          dispatchedAt: true,
        },
      });
      expect(persistedDelivery.status).toBe('sent');
      expect(persistedDelivery.dispatchedAt).toEqual(firstFinalize.dispatchedAt);

      const persistedMember = await prisma.registrarArtistMember.findUniqueOrThrow({
        where: { id: queuedMember.id },
        select: {
          inviteStatus: true,
        },
      });
      expect(persistedMember.inviteStatus).toBe('sent');
    } finally {
      if (registrarEntryId) {
        await prisma.registrarInviteDelivery.deleteMany({
          where: {
            registrarArtistMember: {
              registrarEntryId,
            },
          },
        });

        await prisma.registrarArtistMember.deleteMany({
          where: { registrarEntryId },
        });

        await prisma.registrarEntry.deleteMany({
          where: { id: registrarEntryId },
        });
      }

      if (sceneId) {
        await prisma.community.deleteMany({
          where: { id: sceneId },
        });
      }

      if (submitterId) {
        await prisma.user.deleteMany({
          where: { id: submitterId },
        });
      }
    }
  });
});
