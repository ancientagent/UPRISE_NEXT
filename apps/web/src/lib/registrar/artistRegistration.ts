export type RegistrarEntityType = 'artist' | 'band';

export interface RegistrarArtistMemberDraft {
  name: string;
  email: string;
  city: string;
  instrument: string;
}

export interface ArtistBandRegistrationPayload {
  sceneId: string;
  name: string;
  slug: string;
  entityType: RegistrarEntityType;
  members: RegistrarArtistMemberDraft[];
}

export function createEmptyRegistrarArtistMember(): RegistrarArtistMemberDraft {
  return {
    name: '',
    email: '',
    city: '',
    instrument: '',
  };
}

export function normalizeArtistBandSlug(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 140);
}

export function buildArtistBandRegistrationPayload(params: {
  sceneId: string;
  name: string;
  slugInput: string;
  entityType: RegistrarEntityType;
  members: RegistrarArtistMemberDraft[];
}): ArtistBandRegistrationPayload {
  const sceneId = params.sceneId.trim();
  const name = params.name.trim();
  const slug = normalizeArtistBandSlug(params.slugInput || name);

  const members = params.members
    .map((member) => ({
      name: member.name.trim(),
      email: member.email.trim().toLowerCase(),
      city: member.city.trim(),
      instrument: member.instrument.trim(),
    }))
    .filter((member) => member.name || member.email || member.city || member.instrument);

  return {
    sceneId,
    name,
    slug,
    entityType: params.entityType,
    members,
  };
}
