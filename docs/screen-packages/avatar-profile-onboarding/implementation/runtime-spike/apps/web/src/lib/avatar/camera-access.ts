interface CameraAccessInput {
  isSecureContext: boolean;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  development: boolean;
}

type CameraAccessResolution =
  | { kind: 'ready' }
  | { kind: 'redirect'; href: string }
  | { kind: 'blocked' };

function isPrivateDevelopmentHost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('10.') ||
    hostname.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(hostname)
  );
}

export function resolveCameraAccess(input: CameraAccessInput): CameraAccessResolution {
  if (input.isSecureContext) return { kind: 'ready' };

  if (input.development && isPrivateDevelopmentHost(input.hostname)) {
    const port = input.port ? `:${input.port}` : '';
    return {
      kind: 'redirect',
      href: `http://localhost${port}${input.pathname}${input.search}`,
    };
  }

  return { kind: 'blocked' };
}

export function prepareBrowserCameraAccess(): CameraAccessResolution {
  return resolveCameraAccess({
    isSecureContext: window.isSecureContext,
    hostname: window.location.hostname,
    port: window.location.port,
    pathname: window.location.pathname,
    search: window.location.search,
    development: process.env.NODE_ENV !== 'production',
  });
}
