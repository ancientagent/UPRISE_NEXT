import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('cross-route UX consistency lock', () => {
  it('keeps registrar submission actions explicitly auth-gated before the form opens', () => {
    const registrarSource = readRepoFile('src/app/registrar/page.tsx');

    expect(registrarSource).toContain('Sign in is required before opening registrar submission actions.');
    expect(registrarSource).toContain('Eligibility Snapshot');
    expect(registrarSource).toContain('Registrar actions still file against your Home Scene');
    expect(registrarSource).toContain('disabled={!token}');
    expect(registrarSource).toContain('Promoter Capability Code');
    expect(registrarSource).toContain('Verify Code');
    expect(registrarSource).toContain('Redeem Code');
    expect(registrarSource).toContain("{selectedAction === 'artist_band' && token && (");
    expect(registrarSource).toContain("{selectedAction === 'promoter' && token && (");
    expect(registrarSource).toContain('Promoter Registration');
    expect(registrarSource).toContain('Submit Promoter Registration');
    expect(registrarSource).toContain('My Promoter Registrations');
  });

  it('keeps community-to-plot scene handoff explicit instead of routing generically', () => {
    const communitySource = readRepoFile('src/app/community/[id]/page.tsx');

    expect(communitySource).toContain("import { tuneDiscoverScene } from '@/lib/discovery/client';");
    expect(communitySource).toContain('const handleVisitSceneInPlot = async () => {');
    expect(communitySource).toContain('const response = await tuneDiscoverScene(community.id, token);');
    expect(communitySource).toContain('setDiscoveryContext({');
    expect(communitySource).toContain("router.push('/plot');");
    expect(communitySource).toContain('Visit Scene in Plot');
  });

  it('keeps linked artist-band entities on user profiles navigable', () => {
    const usersSource = readRepoFile('src/app/users/[id]/page.tsx');

    expect(usersSource).toContain("import Link from 'next/link';");
    expect(usersSource).toContain('href={`/artist-bands/${entity.id}`}');
    expect(usersSource).toContain('Linked Artist/Band Entities');
  });

  it('keeps print-shop event creation source-facing and auth-gated', () => {
    const printShopSource = readRepoFile('src/app/print-shop/page.tsx');

    expect(printShopSource).toContain('Source-Facing Event Creation');
    expect(printShopSource).toContain('Source Context');
    expect(printShopSource).toContain('Print Shop stays source-facing.');
    expect(printShopSource).toContain('Source Dashboard');
    expect(printShopSource).toContain('Sign in is required before opening Print Shop creator tools.');
    expect(printShopSource).toContain('Print Shop event creation requires active promoter capability or a linked Artist/Band source.');
    expect(printShopSource).toContain('Create Event');
  });

  it('keeps an artist-facing route into Print Shop for linked members only', () => {
    const artistSource = readRepoFile('src/app/artist-bands/[id]/page.tsx');

    expect(artistSource).toContain('const viewerCanOpenPrintShop = useMemo(() => {');
    expect(artistSource).toContain("profile.members.some((member) => member.userId === user.id)");
    expect(artistSource).toContain('<Link href="/source-dashboard">Source Dashboard</Link>');
    expect(artistSource).toContain('<Link href="/print-shop">Open Print Shop</Link>');
  });

  it('keeps a dedicated source dashboard route for source-side tools', () => {
    const dashboardSource = readRepoFile('src/app/source-dashboard/page.tsx');

    expect(dashboardSource).toContain('Select a source account');
    expect(dashboardSource).toContain('Source-facing tools live here.');
    expect(dashboardSource).toContain('Return to Listener Account');
    expect(dashboardSource).toContain('<Link href="/registrar">Open Registrar</Link>');
  });
});
