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
    expect(eventsSource).toContain('Published by {item.createdBy?.displayName || item.createdBy?.username || \'Scene organizer\'}');
    expect(eventsSource).toContain('{formatEventStatus(item.startDate, item.endDate)}');
  });

  it('locks promotions rows to show source and validity context', () => {
    const promotionsSource = readRepoFile('src/components/plot/PlotPromotionsPanel.tsx');

    expect(promotionsSource).toContain("function metadataValue(metadata: CommunityPromotionItem['metadata'], keys: string[]): string | null");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['status']) ?? item.type");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['callToAction']) ?? 'Promotion posted.'");
    expect(promotionsSource).toContain("metadataValue(item.metadata, ['expiresAt', 'expiration'])");
  });
});
