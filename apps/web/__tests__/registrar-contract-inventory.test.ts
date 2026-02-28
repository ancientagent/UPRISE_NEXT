import {
  MVP_FLOW_ROUTE_CONTRACTS,
  REGISTRAR_WEB_ENDPOINT_CONTRACTS,
  REGISTRAR_WEB_FIELD_GAPS,
  getRegistrarWebGapContracts,
  getRegistrarWebImplementedContracts,
  registrarArtistEndpoints,
  registrarPromoterEndpoints,
  registrarProjectEndpoints,
  registrarSectMotionEndpoints,
} from '../src/lib/registrar/contractInventory';

describe('registrar contract inventory', () => {
  it('keeps MVP flow route contract ids unique', () => {
    const ids = MVP_FLOW_ROUTE_CONTRACTS.map((contract) => contract.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('locks onboarding -> plot -> registrar dependency routes for MVP flow map R1', () => {
    const byId = new Map(MVP_FLOW_ROUTE_CONTRACTS.map((contract) => [contract.id, contract]));

    expect(byId.get('onboarding_home_scene')).toEqual({
      id: 'onboarding_home_scene',
      webRoute: '/onboarding',
      apiDependencies: ['/onboarding/home-scene', '/onboarding/gps-verify', '/communities/resolve-home'],
      notes: 'Home Scene resolution and GPS eligibility feed Plot and Registrar dependencies.',
    });
    expect(byId.get('plot_scene_dashboard')).toEqual({
      id: 'plot_scene_dashboard',
      webRoute: '/plot',
      apiDependencies: ['/communities/resolve-home'],
      notes: 'Plot route depends on resolved Home Scene context before scene-scoped reads.',
    });
    expect(byId.get('registrar_scene_actions')).toEqual({
      id: 'registrar_scene_actions',
      webRoute: '/registrar',
      apiDependencies: ['/onboarding/home-scene', '/onboarding/gps-verify', '/registrar/artist'],
      notes: 'Registrar submit flow depends on scene-scoped onboarding + GPS eligibility context.',
    });
  });

  it('keeps MVP flow route dependencies non-empty and rooted to API paths', () => {
    expect(MVP_FLOW_ROUTE_CONTRACTS.length).toBe(3);
    for (const contract of MVP_FLOW_ROUTE_CONTRACTS) {
      expect(contract.apiDependencies.length).toBeGreaterThan(0);
      for (const path of contract.apiDependencies) {
        expect(path.startsWith('/')).toBe(true);
      }
    }
  });

  it('keeps endpoint ids unique', () => {
    const ids = REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => contract.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('keeps method + pathTemplate pairs unique', () => {
    const pairs = REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => `${contract.method}:${contract.pathTemplate}`);
    expect(new Set(pairs).size).toBe(pairs.length);
  });

  it('ensures implemented contracts map to a concrete web consumer path', () => {
    const implemented = getRegistrarWebImplementedContracts();
    expect(implemented.length).toBeGreaterThan(0);
    for (const contract of implemented) {
      expect(contract.webConsumerPath).toBeTruthy();
    }
  });

  it('enforces metadata coherence for implemented and gap contracts', () => {
    for (const contract of REGISTRAR_WEB_ENDPOINT_CONTRACTS) {
      if (contract.status === 'implemented') {
        expect(contract.webConsumerPath).toBeTruthy();
        expect(contract.gapKind).toBeNull();
      } else {
        expect(contract.status).toBe('gap');
        expect(contract.webConsumerPath).toBeNull();
        expect(contract.gapKind).toBeTruthy();
      }
    }
  });

  it('captures expected unresolved endpoint gaps', () => {
    const gapIds = new Set(getRegistrarWebGapContracts().map((contract) => contract.id));
    const requiredGapIds = [
      'registrar.promoter.submit',
      'registrar.promoter.entries.list',
      'registrar.promoter.entry.detail',
      'auth.invite.preview',
      'auth.invite.register',
      'registrar.project.submit',
      'registrar.project.entries.list',
      'registrar.project.entry.detail',
      'registrar.sect_motion.submit',
      'registrar.sect_motion.entries.list',
      'registrar.sect_motion.entry.detail',
      'registrar.code.issue',
      'registrar.code.verify',
      'registrar.code.redeem',
    ];
    for (const requiredGapId of requiredGapIds) {
      expect(gapIds.has(requiredGapId)).toBe(true);
    }
  });

  it('tracks currently implemented registrar read API surfaces in inventory metadata', () => {
    const ids = new Set(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => contract.id));
    const requiredImplementedReadIds = [
      'registrar.artist.entries.list',
      'registrar.artist.entry.invites',
      'registrar.promoter.entries.list',
      'registrar.promoter.entry.detail',
      'registrar.promoter.entry.capability_audit',
      'registrar.project.entries.list',
      'registrar.project.entry.detail',
      'registrar.sect_motion.entries.list',
      'registrar.sect_motion.entry.detail',
    ];

    for (const id of requiredImplementedReadIds) {
      expect(ids.has(id)).toBe(true);
    }
  });

  it('keeps registrar read scaffolds explicitly marked as web-surface gaps', () => {
    const indexed = new Map(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => [contract.id, contract]));
    const expectedReadScaffoldGaps: Array<[string, string]> = [
      ['registrar.promoter.entries.list', '/registrar/promoter/entries'],
      ['registrar.promoter.entry.detail', '/registrar/promoter/:entryId'],
      ['registrar.promoter.entry.capability_audit', '/registrar/promoter/:entryId/capability-audit'],
      ['registrar.project.entries.list', '/registrar/project/entries'],
      ['registrar.project.entry.detail', '/registrar/project/:entryId'],
      ['registrar.sect_motion.entries.list', '/registrar/sect-motion/entries'],
      ['registrar.sect_motion.entry.detail', '/registrar/sect-motion/:entryId'],
    ];

    for (const [id, pathTemplate] of expectedReadScaffoldGaps) {
      const contract = indexed.get(id);
      expect(contract).toEqual(
        expect.objectContaining({
          id,
          method: 'GET',
          pathTemplate,
          status: 'gap',
          gapKind: 'web_surface_missing',
          webConsumerPath: null,
        }),
      );
    }
  });

  it('keeps project and sect read contracts aligned to implemented API paths with action-gated web status', () => {
    const indexed = new Map(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => [contract.id, contract]));
    const expected = [
      ['registrar.project.entries.list', '/registrar/project/entries'],
      ['registrar.project.entry.detail', '/registrar/project/:entryId'],
      ['registrar.sect_motion.entries.list', '/registrar/sect-motion/entries'],
      ['registrar.sect_motion.entry.detail', '/registrar/sect-motion/:entryId'],
    ] as const;

    for (const [id, pathTemplate] of expected) {
      const contract = indexed.get(id);
      expect(contract).toEqual(
        expect.objectContaining({
          id,
          method: 'GET',
          pathTemplate,
          status: 'gap',
          gapKind: 'web_surface_missing',
          webConsumerPath: null,
        }),
      );
      expect(contract?.notes).toContain('API read path implemented');
      expect(contract?.notes).toContain('action-gated');
    }
  });

  it('tracks deferred admin-lifecycle read surfaces as action-gated placeholders', () => {
    const indexed = new Map(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => [contract.id, contract]));
    const deferredAdminSurfaceIds = [
      'registrar.promoter.entries.list',
      'registrar.promoter.entry.detail',
      'registrar.promoter.entry.capability_audit',
    ];

    for (const id of deferredAdminSurfaceIds) {
      const contract = indexed.get(id);
      expect(contract).toEqual(
        expect.objectContaining({
          id,
          status: 'gap',
          gapKind: 'web_surface_missing',
          webConsumerPath: null,
          deferredAdminLifecycle: 'action_gated',
        }),
      );
    }
  });

  it('tracks field-level gaps against known endpoint ids', () => {
    const endpointIds = new Set(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => contract.id));
    expect(REGISTRAR_WEB_FIELD_GAPS.length).toBeGreaterThan(0);
    for (const fieldGap of REGISTRAR_WEB_FIELD_GAPS) {
      expect(endpointIds.has(fieldGap.endpointId)).toBe(true);
    }
  });

  it('keeps normalized metadata notes for action-gated gap contracts', () => {
    const byId = new Map(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => [contract.id, contract]));
    const apiAvailable = 'API available; web surface remains action-gated.';
    const apiReadImplemented =
      'API read path implemented; web surface remains action-gated with typed client scaffolding only.';

    for (const id of [
      'registrar.promoter.submit',
      'auth.invite.preview',
      'auth.invite.register',
      'registrar.project.submit',
      'registrar.sect_motion.submit',
      'registrar.code.verify',
      'registrar.code.redeem',
    ]) {
      expect(byId.get(id)?.notes).toBe(apiAvailable);
    }

    for (const id of [
      'registrar.project.entries.list',
      'registrar.project.entry.detail',
      'registrar.sect_motion.entries.list',
      'registrar.sect_motion.entry.detail',
    ]) {
      expect(byId.get(id)?.notes).toBe(apiReadImplemented);
    }

    expect(byId.get('registrar.promoter.entry.capability_audit')?.notes).toBe(
      'API available; deferred admin-lifecycle audit read surface remains action-gated on web.',
    );
  });

  it('keeps web-surface-missing gap notes aligned to action-gated boundaries', () => {
    const webSurfaceGaps = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter(
      (contract) => contract.status === 'gap' && contract.gapKind === 'web_surface_missing',
    );
    expect(webSurfaceGaps.length).toBeGreaterThan(0);
    for (const contract of webSurfaceGaps) {
      expect(contract.notes.toLowerCase()).toContain('action-gated');
    }
  });

  it('keeps implemented contracts free of action-gated wording', () => {
    const implemented = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter((contract) => contract.status === 'implemented');
    expect(implemented.length).toBeGreaterThan(0);
    for (const contract of implemented) {
      expect(contract.notes.toLowerCase()).not.toContain('action-gated');
    }
  });

  it('keeps action-gated gap note variants normalized to known canonical strings', () => {
    const allowed = new Set([
      'API available; web surface remains action-gated.',
      'API read path implemented; web surface remains action-gated with typed client scaffolding only.',
      'API available; deferred admin-lifecycle read surface remains action-gated on web.',
      'API available; deferred admin-lifecycle audit read surface remains action-gated on web.',
    ]);

    const actionGatedGapNotes = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter(
      (contract) => contract.status === 'gap' && contract.notes.toLowerCase().includes('action-gated'),
    ).map((contract) => contract.notes);

    expect(actionGatedGapNotes.length).toBeGreaterThan(0);
    for (const note of actionGatedGapNotes) {
      expect(allowed.has(note)).toBe(true);
    }
  });

  it('keeps api_not_available notes distinct from action-gated wording', () => {
    const apiNotAvailable = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter(
      (contract) => contract.status === 'gap' && contract.gapKind === 'api_not_available',
    );
    expect(apiNotAvailable.length).toBeGreaterThan(0);
    for (const contract of apiNotAvailable) {
      expect(contract.notes.toLowerCase()).not.toContain('action-gated');
      expect(contract.notes.toLowerCase()).toContain('not published');
    }
  });

  it('keeps action-gated note strings free from leading/trailing whitespace drift', () => {
    const actionGatedNotes = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter((contract) =>
      contract.notes.toLowerCase().includes('action-gated'),
    ).map((contract) => contract.notes);
    expect(actionGatedNotes.length).toBeGreaterThan(0);
    for (const note of actionGatedNotes) {
      expect(note).toBe(note.trim());
      expect(note.includes('  ')).toBe(false);
    }
  });

  it('keeps web-surface gap notes explicitly scoped to web-surface wording', () => {
    const webSurfaceGaps = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter(
      (contract) => contract.status === 'gap' && contract.gapKind === 'web_surface_missing',
    );
    expect(webSurfaceGaps.length).toBeGreaterThan(0);
    for (const contract of webSurfaceGaps) {
      const note = contract.notes.toLowerCase();
      expect(note).toContain('surface');
      expect(note).toContain('web');
    }
  });

  it('keeps deferred-admin lifecycle metadata and note wording in strict parity', () => {
    const deferredAdminContracts = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter(
      (contract) => contract.deferredAdminLifecycle === 'action_gated',
    );
    expect(deferredAdminContracts.length).toBeGreaterThan(0);

    for (const contract of deferredAdminContracts) {
      expect(contract.status).toBe('gap');
      expect(contract.gapKind).toBe('web_surface_missing');
      expect(contract.notes.toLowerCase()).toContain('deferred admin-lifecycle');
      expect(contract.notes.toLowerCase()).toContain('action-gated');
    }

    const nonDeferred = REGISTRAR_WEB_ENDPOINT_CONTRACTS.filter(
      (contract) => contract.deferredAdminLifecycle !== 'action_gated',
    );
    for (const contract of nonDeferred) {
      expect(contract.notes.toLowerCase().includes('deferred admin-lifecycle')).toBe(false);
    }
  });

  it('keeps MVP flow map implemented/deferred registrar boundaries aligned with inventory status', () => {
    const byId = new Map(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => [contract.id, contract]));
    const implementedNow = [
      'registrar.artist.submit',
      'registrar.artist.entries.list',
      'registrar.artist.entry.invites',
    ];
    const deferredActionGated = [
      'registrar.promoter.submit',
      'registrar.promoter.entries.list',
      'registrar.promoter.entry.detail',
      'registrar.promoter.entry.capability_audit',
      'registrar.project.submit',
      'registrar.sect_motion.submit',
      'registrar.code.verify',
      'registrar.code.redeem',
    ];

    for (const id of implementedNow) {
      expect(byId.get(id)).toEqual(
        expect.objectContaining({
          id,
          status: 'implemented',
          gapKind: null,
        }),
      );
    }

    for (const id of deferredActionGated) {
      expect(byId.get(id)).toEqual(
        expect.objectContaining({
          id,
          status: 'gap',
          gapKind: 'web_surface_missing',
        }),
      );
      expect(byId.get(id)?.notes.toLowerCase()).toContain('action-gated');
    }
  });
});

describe('registrar artist endpoint helpers', () => {
  it('builds concrete registrar artist endpoint paths', () => {
    expect(registrarArtistEndpoints.submit()).toBe('/registrar/artist');
    expect(registrarArtistEndpoints.listEntries()).toBe('/registrar/artist/entries');
    expect(registrarArtistEndpoints.materialize('entry-1')).toBe('/registrar/artist/entry-1/materialize');
    expect(registrarArtistEndpoints.dispatchInvites('entry-1')).toBe('/registrar/artist/entry-1/dispatch-invites');
    expect(registrarArtistEndpoints.syncMembers('entry-1')).toBe('/registrar/artist/entry-1/sync-members');
    expect(registrarArtistEndpoints.inviteStatus('entry-1')).toBe('/registrar/artist/entry-1/invites');
  });

  it('rejects empty entry ids for entry-scoped endpoints', () => {
    expect(() => registrarArtistEndpoints.materialize('  ')).toThrow('Registrar entryId is required');
    expect(() => registrarArtistEndpoints.dispatchInvites('')).toThrow('Registrar entryId is required');
    expect(() => registrarArtistEndpoints.syncMembers('\n')).toThrow('Registrar entryId is required');
    expect(() => registrarArtistEndpoints.inviteStatus('\t')).toThrow('Registrar entryId is required');
  });
});

describe('registrar project endpoint helpers', () => {
  it('builds concrete registrar project endpoint paths', () => {
    expect(registrarProjectEndpoints.submit()).toBe('/registrar/project');
    expect(registrarProjectEndpoints.listEntries()).toBe('/registrar/project/entries');
    expect(registrarProjectEndpoints.detail('entry-1')).toBe('/registrar/project/entry-1');
    expect(registrarProjectEndpoints.detail('  entry-1  ')).toBe('/registrar/project/entry-1');
  });

  it('rejects empty entry id for project detail endpoint', () => {
    expect(() => registrarProjectEndpoints.detail('')).toThrow('Registrar entryId is required');
    expect(() => registrarProjectEndpoints.detail('  ')).toThrow('Registrar entryId is required');
  });
});

describe('registrar promoter endpoint helpers', () => {
  it('builds concrete registrar promoter endpoint paths', () => {
    expect(registrarPromoterEndpoints.submit()).toBe('/registrar/promoter');
    expect(registrarPromoterEndpoints.listEntries()).toBe('/registrar/promoter/entries');
    expect(registrarPromoterEndpoints.detail('entry-1')).toBe('/registrar/promoter/entry-1');
    expect(registrarPromoterEndpoints.capabilityAudit('entry-1')).toBe(
      '/registrar/promoter/entry-1/capability-audit',
    );
  });

  it('rejects empty entry id for promoter entry-scoped endpoints', () => {
    expect(() => registrarPromoterEndpoints.detail('')).toThrow('Registrar entryId is required');
    expect(() => registrarPromoterEndpoints.capabilityAudit('   ')).toThrow('Registrar entryId is required');
  });
});

describe('registrar sect-motion endpoint helpers', () => {
  it('builds concrete registrar sect-motion endpoint paths', () => {
    expect(registrarSectMotionEndpoints.submit()).toBe('/registrar/sect-motion');
    expect(registrarSectMotionEndpoints.listEntries()).toBe('/registrar/sect-motion/entries');
    expect(registrarSectMotionEndpoints.detail('entry-1')).toBe('/registrar/sect-motion/entry-1');
    expect(registrarSectMotionEndpoints.detail('  entry-1  ')).toBe('/registrar/sect-motion/entry-1');
  });

  it('rejects empty entry id for sect-motion detail endpoint', () => {
    expect(() => registrarSectMotionEndpoints.detail('')).toThrow('Registrar entryId is required');
    expect(() => registrarSectMotionEndpoints.detail('  ')).toThrow('Registrar entryId is required');
  });
});
