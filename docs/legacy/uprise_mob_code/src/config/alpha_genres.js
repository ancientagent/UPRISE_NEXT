// Editable alpha sub-genre list for onboarding (client-side fallback).
// Admins/maintainers can update this list as needed during alpha.
// When backend endpoints are available, services will prefer server data.

export const ALPHA_GENRES = [
  { id: 'hardcore-punk', name: 'Hardcore Punk', aliases: ['hardcore', 'hxc'], approved: true },
  { id: 'trap', name: 'Trap', aliases: ['trap music'], approved: true },
  { id: 'death-metal', name: 'Death Metal', aliases: ['death'], approved: true },
  { id: 'house', name: 'House', aliases: ['house music'], approved: true },
  { id: 'indie-rock', name: 'Indie Rock', aliases: ['indie'], approved: true },
  { id: 'grunge', name: 'Grunge', aliases: [], approved: true },
  { id: 'drill', name: 'Drill', aliases: [], approved: true },
  { id: 'melodic-hardcore', name: 'Melodic Hardcore', aliases: [], approved: true },
  { id: 'hard-techno', name: 'Hard Techno', aliases: [], approved: true },
  { id: 'hardstyle', name: 'Hardstyle', aliases: [], approved: true },
  // ... add more as needed
];

export default ALPHA_GENRES;

