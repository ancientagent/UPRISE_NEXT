-- Remove legacy transitional artist marker after canonical linked-entity migration.
ALTER TABLE "users"
DROP COLUMN "isArtist";
