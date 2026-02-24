import { REGISTRAR_CODE_API_SCAFFOLD } from '../src/lib/registrar/client';

describe('registrar client scaffolding', () => {
  it('keeps registrar code endpoints unresolved until API routes are published', () => {
    expect(REGISTRAR_CODE_API_SCAFFOLD).toEqual({
      issueForApprovedPromoterEntryEndpoint: null,
      redeemEndpoint: null,
      verifyEndpoint: null,
    });
  });
});
