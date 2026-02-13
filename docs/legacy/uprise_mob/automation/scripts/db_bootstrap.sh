#!/usr/bin/env bash
set -euo pipefail

# DB Bootstrap (idempotent, non-destructive)
# - Ensures PostGIS
# - Attempts minimal seed for happy-path smokes
# - Prints "created" or "already-present"; skips if tables/columns missing

API_BASE_URL="${API_BASE_URL:-http://127.0.0.1:3000}"
PG_HOST="${PG_HOST:-127.0.0.1}"
PG_PORT="${PG_PORT:-5433}"
PG_DB="${PG_DB:-uprise_dev}"
PG_USER="${PG_USER:-uprise}"

conn="postgres://${PG_USER}@${PG_HOST}:${PG_PORT}/${PG_DB}"

banner(){ printf "\n=== %s ===\n" "$*"; }
notice(){ printf "- %s\n" "$*"; }

banner "PostGIS extension"
psql "$conn" -v ON_ERROR_STOP=1 -c "CREATE EXTENSION IF NOT EXISTS postgis;"
notice "postgis: ensured"

banner "Admin role and user (idempotent)"
psql "$conn" -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='roles') THEN
    IF NOT EXISTS (SELECT 1 FROM roles WHERE lower(name) = 'admin') THEN
      INSERT INTO roles(name, createdAt, updatedAt) VALUES ('admin', now(), now());
      RAISE NOTICE 'roles: admin created';
    ELSE
      RAISE NOTICE 'roles: admin already-present';
    END IF;
  ELSE
    RAISE NOTICE 'roles table missing; skipping';
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='users') THEN
    IF NOT EXISTS (SELECT 1 FROM users WHERE lower(email) = 'admin@local.test') THEN
      -- Password should be set via API for hashing; create a placeholder inactive user
      INSERT INTO users("firstName","lastName","userName",email,status,"createdAt","updatedAt")
      VALUES ('Admin','User','admin_local','admin@local.test','ACTIVE', now(), now());
      RAISE NOTICE 'users: admin@local.test created (no password; set via API)';
    ELSE
      RAISE NOTICE 'users: admin@local.test already-present';
    END IF;
  ELSE
    RAISE NOTICE 'users table missing; skipping';
  END IF;
END$$;
SQL

banner "Genres (sample from 97-genre set)"
psql "$conn" -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='genres') THEN
    IF NOT EXISTS (SELECT 1 FROM genres WHERE lower(name) = 'hip hop') THEN
      INSERT INTO genres(name, "createdAt","updatedAt") VALUES ('Hip Hop', now(), now());
      RAISE NOTICE 'genres: Hip Hop created';
    ELSE
      RAISE NOTICE 'genres: Hip Hop already-present';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM genres WHERE lower(name) = 'punk') THEN
      INSERT INTO genres(name, "createdAt","updatedAt") VALUES ('Punk', now(), now());
      RAISE NOTICE 'genres: Punk created';
    ELSE
      RAISE NOTICE 'genres: Punk already-present';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM genres WHERE lower(name) = 'electronic') THEN
      INSERT INTO genres(name, "createdAt","updatedAt") VALUES ('Electronic', now(), now());
      RAISE NOTICE 'genres: Electronic created';
    ELSE
      RAISE NOTICE 'genres: Electronic already-present';
    END IF;
  ELSE
    RAISE NOTICE 'genres table missing; skipping';
  END IF;
END$$;
SQL

banner "Community (austin-texas-hip-hop)"
psql "$conn" -v ON_ERROR_STOP=1 <<'SQL'
DO $$
BEGIN
  -- Prefer Communities table if it exists; otherwise use Locations as fallback
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='communities') THEN
    IF NOT EXISTS (SELECT 1 FROM communities WHERE community_key='austin-texas-hip-hop') THEN
      INSERT INTO communities(community_key, city, state, genre, "createdAt","updatedAt")
      VALUES ('austin-texas-hip-hop','Austin','Texas','Hip Hop', now(), now());
      RAISE NOTICE 'communities: austin-texas-hip-hop created';
    ELSE
      RAISE NOTICE 'communities: austin-texas-hip-hop already-present';
    END IF;
  ELSIF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='locations') THEN
    IF NOT EXISTS (SELECT 1 FROM locations WHERE lower(city)='austin' AND lower(state)='texas') THEN
      INSERT INTO locations(city,state,latitude,longitude,"createdAt","updatedAt")
      VALUES ('Austin','Texas', 30.2672, -97.7431, now(), now());
      RAISE NOTICE 'locations: Austin, Texas created';
    ELSE
      RAISE NOTICE 'locations: Austin, Texas already-present';
    END IF;
  ELSE
    RAISE NOTICE 'communities/locations tables missing; skipping';
  END IF;
END$$;
SQL

banner "ArtistProfile (linked to a user)"
psql "$conn" -v ON_ERROR_STOP=1 <<'SQL'
DO $$
DECLARE v_user_id integer;
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='artistprofiles') THEN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name='users') THEN
      SELECT id INTO v_user_id FROM users WHERE lower(email)='admin@local.test' LIMIT 1;
      IF v_user_id IS NULL THEN
        RAISE NOTICE 'artistprofile: no user admin@local.test found; skipping';
      ELSE
        IF NOT EXISTS (SELECT 1 FROM artistprofiles WHERE "userId"=v_user_id) THEN
          INSERT INTO artistprofiles(title, "userId", status, "createdAt","updatedAt")
          VALUES ('Admin Artist', v_user_id, 'ACTIVE', now(), now());
          RAISE NOTICE 'artistprofiles: created for admin@local.test';
        ELSE
          RAISE NOTICE 'artistprofiles: already-present for admin@local.test';
        END IF;
      END IF;
    ELSE
      RAISE NOTICE 'users table missing; skipping artistprofile';
    END IF;
  ELSE
    RAISE NOTICE 'artistprofiles table missing; skipping';
  END IF;
END$$;
SQL

echo "\nBootstrap complete (idempotent). Review notices above for created/already-present/skipped."

