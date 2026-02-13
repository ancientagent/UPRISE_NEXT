# Webapp API Audit Report (webapp_api)

- **Repo URL Analyzed**: `git@gitlab.com:imaginnovate_ps/upriseradiyo/webapp_api.git`
- **Commit SHA Scanned**: `N/A (Static analysis in a read-only environment)`
- **Analysis Timestamp**: `2025-09-02 22:34:45 UTC`

---

## 1. Executive Summary

This repository contains the backend API for the Uprise Radio application. It is a **Node.js application built with the Express framework**. It uses a **PostgreSQL database** via the **Sequelize ORM**. The application is designed to be deployed as a **Docker container**.

Contrary to initial expectations of a Firebase backend, this API uses a traditional monolithic structure. However, it integrates with several external services, including:
-   **AWS S3:** For all file storage (e.g., song files, user avatars).
-   **Firebase Admin SDK:** Specifically for sending push notifications (Firebase Cloud Messaging).
-   **SendGrid:** For transactional emails (e.g., email verification, password reset).

The API is well-structured, with clear separation of concerns for routes, models, and configuration. It includes a robust authentication system using JWTs and a role-based access control mechanism. The codebase appears healthy, with no `FIXME` markers and a comprehensive set of database migrations indicating a mature project history.

---

## 2. Architecture & Data Flow

### Architecture Diagram (Inferred)

```
+----------------+      +------------------------+      +----------------+
|  Mobile Client |----->|   Node.js API Server   |----->|   PostgreSQL   |
| (e.g., uprise_mob) |      |      (Express)         |      | (via Sequelize)|
|                |<-----|                        |<-----|                |
+----------------+      +-----------+------------+      +----------------+
                            |           |
                            |           |
                            v           v
                        +------+   +-------------------+
                        | AWS S3 |   | Firebase Cloud Msg|
                        | Storage|   | (Push Notifications)|
                        +------+   +-------------------+
                            ^
                            |
                        +-----------+
                        | SendGrid  |
                        |  (Email)  |
                        +-----------+
```

### Data Flow Highlights
-   **Auth:** Clients (mobile/web) authenticate using email/password. The server returns a JWT access token and a refresh token. Subsequent requests are authenticated using the access token in the `Authorization` header. A separate `Client-ID` and `Client-Secret` header is used for machine-to-machine authentication.
-   **File Uploads:** The client uploads files (e.g., MP3s, images) to the API, which then streams them to an AWS S3 bucket. The database stores the S3 URL.
-   **Push Notifications:** When a significant event occurs (e.g., new song uploaded), the API uses the Firebase Admin SDK to send a push notification to relevant users via their stored FCM tokens.
-   **Database:** All core application data (users, songs, bands, votes, etc.) is stored in a PostgreSQL database. The schema is managed via Sequelize migrations.

---

## 3. Technical Inventory

### A. Repo Metadata & Scripts
-   **Engine:** Node.js. The exact version is not pinned (e.g., no `.nvmrc` file), which is a minor risk. The `Dockerfile` uses `node:alpine`.
-   **Framework:** Express.js (`^4.17.2`).
-   **Database:** PostgreSQL with Sequelize (`^6.12.5`).
-   **Scripts:**
    -   `npm start`: Runs the application.
    -   `npm run dev`: Runs in development mode with `nodemon`.
    -   `npm test`: Runs tests with `jest`.
    -   `npm run db:*`: A full suite of scripts for managing the database schema (migrate, seed, etc.).

### B. Dependencies
-   A full list of dependencies is available in `deps_webapp_api.json`.
-   **Critical Dependencies:**
    -   `express`: Web framework.
    -   `sequelize`, `pg`: Database access.
    -   `bcrypt`, `jsonwebtoken`: Authentication.
    -   `aws-sdk`, `multer`, `multer-s3`: File uploads to AWS S3.
    -   `firebase-admin`: Push notifications.
    -   `@sendgrid/mail`: Email.
    -   `swagger-ui-express`: API documentation.
-   **Security Notes:** No immediate EOL or deprecated packages were flagged, but a full `npm audit` should be run.

### C. Platform & Config
-   **Auth:** JWT-based, with role-based access control (`admin`, `artist`, `listener`, `band_owner`, `band_member`).
-   **Data:** 35+ Sequelize models define the schema. See the `src/database/models` directory for a full list. Key models include `User`, `Song`, `Band`, `Vote`.
-   **Analytics:** No specific analytics service (like GA4) was identified in the backend.
-   **Environment Variables:** A comprehensive list of required environment variables was found. Key variables include:
    -   `PORT`, `NODE_ENV`
    -   `DB_HOST`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
    -   `JWT_ACCESS_TOKEN_SECRET`, `JWT_REFRESH_TOKEN_SECRET`
    -   `CLIENT_ID`, `CLIENT_SECRET`
    -   `AWS_ACCESS_KEY`, `AWS_SECRET_KEY`, `AWS_REGION`, `AWS_BUCKET_NAME`
    -   `PUSH_NOTIFICATIONS_SERVICE_ACCOUNT` (JSON string)
    -   `SENDGRID_API_KEY`
    -   `WEB_URL`

### D. Build/CI/CD
-   **CI/CD:** No CI/CD pipeline is configured in the repository.
-   **Build Steps:** The application is built into a Docker image using the provided `Dockerfile`. The process involves installing production dependencies and copying the source code. The final artifact is a Docker image named `uprise-api-server`.

### E. Code Topography
-   **Directory Tree:** The `src/` directory is well-structured:
    -   `config/`: Application configuration.
    -   `crons/`: Scheduled jobs.
    -   `database/`: Migrations, models, and seeders.
    -   `datastore/`: Reusable data access functions.
    -   `middlewares/`: Express middleware (auth).
    -   `routes/`: API route definitions.
    -   `utils/`: Helper modules (email, push notifications, file uploads).
-   **Entry Point:** `src/index.js`.
-   **API Surface:** The API is extensive. See `routes_webapp_api.txt` for a high-level map.
-   **Health:** Code appears healthy. No `FIXME` comments were found.

---

## 4. Risks & Quick Wins

### Risks
-   **[Yellow] Unpinned Node.js Version:** The lack of a `.nvmrc` or `engines` block in `package.json` means developers might use different Node.js versions, leading to inconsistencies. The `Dockerfile` uses `node:alpine`, which is good but doesn't enforce the local development version.
-   **[Yellow] Secrets in `.env.backup`:** The `.env.backup` file contains placeholder and potentially real development secrets. This is a minor security risk and should be rotated if the values were ever used in production.
-   **[Red] No CI/CD Pipeline:** The lack of an automated build, test, and deployment pipeline is a significant risk. This means deployments are likely manual, error-prone, and slow.
-   **[Yellow] No Automated Tests:** A `test` script exists, but no actual test files were found besides a placeholder. The lack of a test suite makes it difficult to refactor or add new features safely.

### Quick Wins
-   **Pin Node.js Version:** Add an `engines` block to `package.json` to specify the required Node.js version, matching the one in the `Dockerfile` if possible.
-   **Create `.env.example`:** Replace `.env.backup` with a `.env.example` file that contains only the variable names and no values, improving security.
-   **Implement Basic CI:** Set up a basic CI pipeline (e.g., using GitLab CI) that runs `npm install` and `npm run lint` on every commit. This is a small first step towards automated quality control.
-   **Write a Health Check Endpoint:** Add a `/health` endpoint that checks the database connection and returns a `200 OK` status. This is useful for load balancers and monitoring.
-   **Run `npm audit`:** Run `npm audit --production` and fix any critical vulnerabilities found in the dependencies.
