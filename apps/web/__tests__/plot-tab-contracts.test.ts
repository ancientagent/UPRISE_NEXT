import fs from 'node:fs';
import path from 'node:path';

const repoRoot = path.resolve(__dirname, '..');

function readRepoFile(relativePath: string): string {
  return fs.readFileSync(path.join(repoRoot, relativePath), 'utf8');
}

describe('plot tab contract locks', () => {
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

  it('locks promotions rows to show source and validity context', () => {
    const promotionsSource = readRepoFile('src/components/plot/PlotPromotionsPanel.tsx');

    expect(promotionsSource).toContain("function metadataValue(metadata: CommunityPromotionItem['metadata'], keys: string[]): string | null");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['status']) ?? item.type");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['callToAction']) ?? 'Promotion posted.'");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['expiresAt', 'expiration'])");
  });

  it('passes structural community labels into feed, events, and promotions headers', () => {
    const plotPageSource = readRepoFile('src/app/plot/page.tsx');
    const feedSource = readRepoFile('src/components/plot/SeedFeedPanel.tsx');
    const eventsSource = readRepoFile('src/components/plot/PlotEventsPanel.tsx');
    const promotionsSource = readRepoFile('src/components/plot/PlotPromotionsPanel.tsx');

    expect(plotPageSource).toContain('communityLabel={selectedCommunityLabel}');
    expect(feedSource).toContain('communityLabel?: string | null;');
    expect(feedSource).toContain("return `S.E.E.D Feed • ${communityLabel}`;");
    expect(feedSource).toContain('scene anchor: ${communityLabel}');
    expect(eventsSource).toContain('communityLabel?: string | null;');
    expect(eventsSource).toContain('Events{communityLabel ? ` • ${communityLabel}` : \'\'}');
    expect(promotionsSource).toContain('communityLabel?: string | null;');
    expect(promotionsSource).toContain('Promotions{communityLabel ? ` • ${communityLabel}` : \'\'}');
  });
});
