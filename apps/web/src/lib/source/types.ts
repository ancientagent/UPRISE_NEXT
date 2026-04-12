export type ManagedSourceAccount = {
  id: string;
  name: string;
  slug: string;
  entityType: string;
  membershipRole: string | null;
};

export type CurrentUserSourceProfile = {
  user: { id: string; hasArtistBand?: boolean };
  managedArtistBands: ManagedSourceAccount[];
};
