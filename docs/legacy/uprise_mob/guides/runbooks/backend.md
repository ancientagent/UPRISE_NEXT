# Backend Runbook (WSL)

## Environment
- Postgres 16 on `127.0.0.1:5433`
- DB: `uprise_dev`
- User: `uprise`
- Password: `Loca$h2682`
- PostGIS enabled

## .env (webapp_api)
DB_HOST=127.0.0.1
DB_USERNAME=uprise
DB_PASSWORD=Loca$h2682
DB_NAME=uprise_dev
DB_PORT=5433

## Migrations
cd /mnt/d/webapp_api
rm -rf node_modules package-lock.json
yarn cache clean
yarn install
yarn sequelize db:migrate:status
yarn sequelize db:migrate

## Run API
yarn start
# Check: curl -s http://127.0.0.1:3000/health

## Troubleshooting
- invalid ELF header → reinstall deps in WSL
- 5432 vs 5433 mismatch → ensure dotenv loads before Sequelize init
- geography type → ensure postgis extension present
