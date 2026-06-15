# Neon Staging Example

Example only. Configure this in Neon for the first hosted staging path.

## Resources

- Project: `uprise`
- Branch: `staging`
- Database: `uprise_staging`

## Requirements

- Enable or confirm PostGIS.
- Capture runtime pooled connection string for `DATABASE_URL`.
- Capture direct migration connection string for `DIRECT_URL` if Prisma needs it.
- Keep staging and production connection strings separate.

## First Validation

After API deployment:

- `GET /health/db`
- `GET /health/postgis`
- `GET /health/ready`
