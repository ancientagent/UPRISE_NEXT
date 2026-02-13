// DEPRECATED (Alpha): Musical Families specification and helpers.
// Not used in the Alpha sub‑genre system. Kept for archival compatibility.
// This module provides a local fallback mapping for families and
// a mapping from legacy super-genres to families for onboarding UX.

export const MUSICAL_FAMILIES = {
  // Hip Hop Territory
  'trap-family': {
    id: 'trap-family',
    name: 'Trap Family',
    territory: 'hip-hop',
    subGenres: ['trap', 'drill', 'mumble-rap', 'soundcloud-rap', 'atlanta-trap'],
  },
  'classic-hip-hop-family': {
    id: 'classic-hip-hop-family',
    name: 'Classic Hip Hop Family',
    territory: 'hip-hop',
    subGenres: ['boom-bap', 'east-coast-hip-hop', 'west-coast-hip-hop', 'conscious-rap'],
  },
  'regional-hip-hop-family': {
    id: 'regional-hip-hop-family',
    name: 'Regional Hip Hop Family',
    territory: 'hip-hop',
    subGenres: ['southern-hip-hop', 'uk-drill', 'afro-hip-hop', 'latin-trap'],
  },
  'alternative-hip-hop-family': {
    id: 'alternative-hip-hop-family',
    name: 'Alternative Hip Hop Family',
    territory: 'hip-hop',
    subGenres: ['abstract-hip-hop', 'jazz-rap', 'experimental-hip-hop', 'indie-hip-hop'],
  },

  // Punk Territory
  'hardcore-punk-family': {
    id: 'hardcore-punk-family',
    name: 'Hardcore Punk Family',
    territory: 'punk',
    subGenres: ['hardcore-punk', 'straight-edge', 'crust-punk', 'd-beat', 'powerviolence'],
  },
  'pop-punk-family': {
    id: 'pop-punk-family',
    name: 'Pop Punk Family',
    territory: 'punk',
    subGenres: ['pop-punk', 'emo', 'post-hardcore', 'emocore', 'melodic-hardcore'],
  },
  'street-punk-family': {
    id: 'street-punk-family',
    name: 'Street Punk Family',
    territory: 'punk',
    subGenres: ['oi', 'street-punk', 'ska-punk', 'punk-rock', 'anarcho-punk'],
  },

  // Metal Territory
  'extreme-metal-family': {
    id: 'extreme-metal-family',
    name: 'Extreme Metal Family',
    territory: 'metal',
    subGenres: ['black-metal', 'death-metal', 'grindcore', 'blackened-death-metal'],
  },
  'classic-metal-family': {
    id: 'classic-metal-family',
    name: 'Classic Metal Family',
    territory: 'metal',
    subGenres: ['heavy-metal', 'power-metal', 'traditional-metal', 'nwobhm', 'speed-metal'],
  },
  'modern-metal-family': {
    id: 'modern-metal-family',
    name: 'Modern Metal Family',
    territory: 'metal',
    subGenres: ['metalcore', 'deathcore', 'djent', 'progressive-metal', 'nu-metal'],
  },
  'doom-sludge-family': {
    id: 'doom-sludge-family',
    name: 'Doom/Sludge Family',
    territory: 'metal',
    subGenres: ['doom-metal', 'sludge-metal', 'stoner-rock', 'post-metal'],
  },

  // Electronic Territory
  'house-family': {
    id: 'house-family',
    name: 'House Family',
    territory: 'electronic',
    subGenres: ['deep-house', 'tech-house', 'progressive-house', 'acid-house', 'future-house'],
  },
  'techno-family': {
    id: 'techno-family',
    name: 'Techno Family',
    territory: 'electronic',
    subGenres: ['detroit-techno', 'minimal-techno', 'industrial-techno', 'acid-techno'],
  },
  'bass-family': {
    id: 'bass-family',
    name: 'Bass Family',
    territory: 'electronic',
    subGenres: ['dubstep', 'drum-and-bass', 'uk-garage', 'future-bass', 'breakbeat'],
  },
  'ambient-experimental-family': {
    id: 'ambient-experimental-family',
    name: 'Ambient/Experimental Family',
    territory: 'electronic',
    subGenres: ['ambient', 'idm', 'experimental-electronic', 'downtempo', 'glitch'],
  },

  // Folk/Country Territory
  'traditional-folk-family': {
    id: 'traditional-folk-family',
    name: 'Traditional Folk Family',
    territory: 'folk-country',
    subGenres: ['traditional-folk', 'celtic-folk', 'bluegrass', 'old-time', 'american-folk'],
  },
  'modern-folk-family': {
    id: 'modern-folk-family',
    name: 'Modern Folk Family',
    territory: 'folk-country',
    subGenres: ['indie-folk', 'folk-rock', 'contemporary-folk', 'singer-songwriter', 'acoustic'],
  },
  'country-family': {
    id: 'country-family',
    name: 'Country Family',
    territory: 'folk-country',
    subGenres: ['country', 'alt-country', 'outlaw-country', 'country-rock', 'americana'],
  },
};

// Map legacy super-genre selection to available families.
// Keys should be lowercase slugs of super genres used in the current app.
export const SUPER_TO_FAMILIES = {
  'hip-hop': ['trap-family', 'classic-hip-hop-family', 'regional-hip-hop-family', 'alternative-hip-hop-family'],
  punk: ['hardcore-punk-family', 'pop-punk-family', 'street-punk-family'],
  metal: ['extreme-metal-family', 'classic-metal-family', 'modern-metal-family', 'doom-sludge-family'],
  electronic: ['house-family', 'techno-family', 'bass-family', 'ambient-experimental-family'],
  'folk-country': ['traditional-folk-family', 'modern-folk-family', 'country-family'],
  folk: ['traditional-folk-family', 'modern-folk-family'],
  country: ['country-family'],
};

export const listFamilies = () => Object.values(MUSICAL_FAMILIES);

export const familiesForSuper = (superSlug) => {
  const ids = SUPER_TO_FAMILIES[superSlug?.toLowerCase?.() || ''] || [];
  return ids.map(id => MUSICAL_FAMILIES[id]).filter(Boolean);
};

export const findFamily = (id) => MUSICAL_FAMILIES[id] || null;

export default {
  MUSICAL_FAMILIES,
  SUPER_TO_FAMILIES,
  listFamilies,
  familiesForSuper,
  findFamily,
};
