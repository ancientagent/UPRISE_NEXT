import { resolveCameraAccess } from '../src/lib/avatar/camera-access';

describe('camera access context', () => {
  it('allows camera requests in a secure context', () => {
    expect(
      resolveCameraAccess({
        isSecureContext: true,
        hostname: 'upriseradiyo.com',
        port: '',
        pathname: '/avatar-test',
        search: '',
        development: false,
      }),
    ).toEqual({ kind: 'ready' });
  });

  it('redirects a private development address to the Windows localhost bridge', () => {
    expect(
      resolveCameraAccess({
        isSecureContext: false,
        hostname: '172.30.113.96',
        port: '3000',
        pathname: '/avatar-test',
        search: '?mode=intake',
        development: true,
      }),
    ).toEqual({
      kind: 'redirect',
      href: 'http://localhost:3000/avatar-test?mode=intake',
    });
  });

  it('blocks an insecure production origin instead of redirecting it', () => {
    expect(
      resolveCameraAccess({
        isSecureContext: false,
        hostname: '10.0.0.4',
        port: '3000',
        pathname: '/avatar-test',
        search: '',
        development: false,
      }),
    ).toEqual({ kind: 'blocked' });
  });
});
