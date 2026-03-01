const SUBGENRE_RANGE_BY_KEYWORD: Array<{ keyword: string; range: string }> = [
  {
    keyword: 'punk',
    range: 'Proto-punk, hardcore, post-punk, emo, crust, melodic punk',
  },
  {
    keyword: 'metal',
    range: 'Heavy, thrash, death, black, doom, sludge, metalcore',
  },
  {
    keyword: 'hip-hop',
    range: 'Boom-bap, trap, drill, alt-rap, turntablism, conscious',
  },
  {
    keyword: 'electronic',
    range: 'House, techno, drum & bass, garage, trance, bass, ambient',
  },
  {
    keyword: 'jazz',
    range: 'Bebop, swing, fusion, modal, avant-jazz, contemporary jazz',
  },
  {
    keyword: 'soul',
    range: 'Classic soul, neo-soul, funk, R&B, gospel-rooted forms',
  },
  {
    keyword: 'folk',
    range: 'Americana, bluegrass, alt-country, singer-songwriter, roots',
  },
  {
    keyword: 'reggae',
    range: 'Roots reggae, dub, dancehall, ska, rocksteady',
  },
  {
    keyword: 'latin',
    range: 'Reggaeton, latin trap, salsa, cumbia, regional + afro-latin blends',
  },
  {
    keyword: 'diasporic',
    range: 'Regional traditions + contemporary diaspora hybrids',
  },
  {
    keyword: 'classical',
    range: 'Orchestral, chamber, contemporary composition, crossover',
  },
  {
    keyword: 'experimental',
    range: 'Noise, industrial, electroacoustic, sound art',
  },
];

export function getCommunitySubgenreRange(musicCommunity?: string | null): string {
  const normalized = (musicCommunity ?? '').toLowerCase();
  if (!normalized) {
    return 'Local subgenre range to be defined by scene moderators.';
  }

  const match = SUBGENRE_RANGE_BY_KEYWORD.find(({ keyword }) => normalized.includes(keyword));
  if (match) {
    return match.range;
  }

  return 'Local subgenre range curated by this community.';
}
