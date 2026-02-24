import {
  REGISTRAR_WEB_ENDPOINT_CONTRACTS,
  REGISTRAR_WEB_FIELD_GAPS,
  getRegistrarWebGapContracts,
  getRegistrarWebImplementedContracts,
  registrarArtistEndpoints,
} from '../src/lib/registrar/contractInventory';

describe('registrar contract inventory', () => {
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

  it('captures expected unresolved endpoint gaps', () => {
    const gapIds = new Set(getRegistrarWebGapContracts().map((contract) => contract.id));
    const requiredGapIds = [
      'registrar.promoter.submit',
      'registrar.promoter.entries.list',
      'registrar.promoter.entry.detail',
      'auth.invite.preview',
      'auth.invite.register',
      'registrar.project.submit',
      'registrar.sect_motion.submit',
      'registrar.code.issue',
      'registrar.code.verify',
      'registrar.code.redeem',
    ];
    for (const requiredGapId of requiredGapIds) {
      expect(gapIds.has(requiredGapId)).toBe(true);
    }
  });

  it('tracks field-level gaps against known endpoint ids', () => {
    const endpointIds = new Set(REGISTRAR_WEB_ENDPOINT_CONTRACTS.map((contract) => contract.id));
    expect(REGISTRAR_WEB_FIELD_GAPS.length).toBeGreaterThan(0);
    for (const fieldGap of REGISTRAR_WEB_FIELD_GAPS) {
      expect(endpointIds.has(fieldGap.endpointId)).toBe(true);
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
