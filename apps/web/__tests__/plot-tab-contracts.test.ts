import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');
const workspaceRoot = path.resolve(repoRoot, '..', '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(workspaceRoot, relativePath), 'utf8');
}

describe('plot tab contract locks', () => {
  it('locks active Plot tabs to Feed, Events, and Archive only', () => {
    const plotSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotSource).toContain("const tabs = ['Feed', 'Events', 'Archive'] as const;");
    expect(plotSource).toContain('type PlotTab = (typeof tabs)[number];');
    expect(plotSource).toContain('tabs.map((tab) =>');
    expect(plotSource).not.toContain("'Promotions'");
    expect(plotSource).not.toContain('"Promotions"');
    expect(plotSource).not.toContain("'Statistics'");
    expect(plotSource).not.toContain('"Statistics"');
    expect(plotSource).not.toContain('PlotPromotionsPanel');
    expect(plotSource).not.toContain('StatisticsPanel');
  });

  it('keeps Archive as read-only descriptive history instead of the Statistics explorer', () => {
    const plotSource = readRepoFile('src/app/plot/page.tsx');

    expect(plotSource).toContain("if (activeTab === 'Archive')");
    expect(plotSource).toContain('TopSongsPanel');
    expect(plotSource).toContain('Scene Activity Snapshot');
    expect(plotSource).toContain('Archive is read-only descriptive history for the current Plot context.');
    expect(plotSource).toContain('not a ranking or authority');
    expect(plotSource).not.toContain('<StatisticsPanel');
    expect(plotSource).not.toContain("from '@/components/plot/StatisticsPanel'");
  });

  it('removes the fake NYC fallback from statistics city scope', () => {
    const statisticsSource = readRepoFile('src/components/plot/StatisticsPanel.tsx');

    expect(statisticsSource).not.toContain('40.7128');
    expect(statisticsSource).not.toContain('-74.006');
    expect(statisticsSource).toContain('const fallbackCommunities = selectedCommunity ? [selectedCommunity] : [];');
    expect(statisticsSource).toContain('if (!gpsCoords) {');
  });

  it('locks events rows to show status and source context', () => {
    const eventsSource = readRepoFile('src/components/plot/PlotEventsPanel.tsx');

    expect(eventsSource).toContain("function formatEventStatus(startDate: string, endDate: string): 'Upcoming' | 'Live now' | 'Ended'");
    expect(eventsSource).toContain('function publishedByLabel(item: CommunityEventItem): string');
    expect(eventsSource).toContain("href={`/artist-bands/${item.artistBand.id}`}");
    expect(eventsSource).toContain('{formatEventStatus(item.startDate, item.endDate)}');
  });

  it('keeps Plot Events read-only without inline calendar mutation actions', () => {
    const eventsSource = readRepoFile('src/components/plot/PlotEventsPanel.tsx');

    expect(eventsSource).toContain('Scene-scoped events ordered by canonical start time.');
    expect(eventsSource).toContain('This panel stays descriptive and locality-bound.');
    expect(eventsSource).not.toContain('Add to calendar');
    expect(eventsSource).not.toContain('addToCalendar');
    expect(eventsSource).not.toContain('onAddToCalendar');
    expect(eventsSource).not.toContain('calendarMutation');
    expect(eventsSource).not.toContain('CalendarButton');
  });

  it('keeps Feed inserts read-only without inline engagement controls', () => {
    const feedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');

    expect(feedSource).toContain('Listener recommendations from this community, surfaced without inline actions.');
    expect(feedSource).toContain('Read-only event snapshots from the current scene context.');
    expect(feedSource).toContain('Read-only event squares with no inline calendar actions.');
    expect(feedSource).not.toContain('Collect</Button>');
    expect(feedSource).not.toContain('Blast</Button>');
    expect(feedSource).not.toContain('Follow</Button>');
    expect(feedSource).not.toContain('handleCollect');
    expect(feedSource).not.toContain('handleBlast');
    expect(feedSource).not.toContain('handleFollow');
  });

  it('keeps promotions as a retained deferred seam, not a current Plot tab', () => {
    const plotSource = readRepoFile('src/app/plot/page.tsx');
    const promotionsSource = readRepoFile('src/components/plot/PlotPromotionsPanel.tsx');
    const printShopSpec = readWorkspaceFile('docs/specs/economy/print-shop-and-promotions.md');

    expect(plotSource).not.toContain('PlotPromotionsPanel');
    expect(printShopSpec).toContain('retained/deferred');
    expect(printShopSpec).not.toContain('Plot Promotions tab lists');
    expect(promotionsSource).toContain("function metadataValue(metadata: CommunityPromotionItem['metadata'], keys: string[]): string | null");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['status']) ?? item.type");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['callToAction']) ?? 'Promotion posted.'");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['expiresAt', 'expiration'])");
  });

  it('passes structural community labels into current feed and events headers', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const feedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');
    const eventsSource = readRepoFile('src/components/plot/PlotEventsPanel.tsx');

    expect(plotPageSource).toContain('communityLabel={selectedCommunityLabel}');
    expect(feedSource).toContain('communityLabel?: string | null;');
    expect(feedSource).toContain("return `S.E.E.D Feed • ${communityLabel}`;");
    expect(feedSource).toContain('scene anchor: ${communityLabel}');
    expect(eventsSource).toContain('communityLabel?: string | null;');
    expect(eventsSource).toContain('Events{communityLabel ? ` • ${communityLabel}` : \'\'}');
  });
});
