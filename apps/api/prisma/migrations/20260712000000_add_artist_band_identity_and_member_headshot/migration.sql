-- Source-owned public identity fields (additive-only, all nullable).
-- These must not be projected from the registering member's listener account;
-- see docs/specs/users/artist-profile-and-source-dashboard.md.
ALTER TABLE "artist_bands"
ADD COLUMN "bio" TEXT,
ADD COLUMN "avatar" TEXT,
ADD COLUMN "coverImage" TEXT;

-- Source-provided public member headshot. Listener-account avatars
-- (users.avatar) are not a public fallback for this field.
ALTER TABLE "artist_band_members"
ADD COLUMN "headshotUrl" TEXT;
