import { useSourceAccountStore } from '../src/store/source-account';

describe('source account context store', () => {
  afterEach(() => {
    useSourceAccountStore.getState().clearActiveSourceId();
    useSourceAccountStore.persist.clearStorage();
  });

  it('stores and clears the active source account id', () => {
    expect(useSourceAccountStore.getState().activeSourceId).toBeNull();

    useSourceAccountStore.getState().setActiveSourceId('artist-band-1');
    expect(useSourceAccountStore.getState().activeSourceId).toBe('artist-band-1');

    useSourceAccountStore.getState().clearActiveSourceId();
    expect(useSourceAccountStore.getState().activeSourceId).toBeNull();
  });
});
