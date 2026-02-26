import { REGISTRAR_CODE_API_SCAFFOLD } from '../src/lib/registrar/client';

describe('registrar client scaffolding', () => {
  it('exposes published registrar code verify/redeem endpoints and keeps issue endpoint unresolved', () => {
    expect(REGISTRAR_CODE_API_SCAFFOLD).toEqual({
      issueForApprovedPromoterEntryEndpoint: null,
      redeemEndpoint: '/registrar/code/redeem',
      verifyEndpoint: '/registrar/code/verify',
    });
  });
});
