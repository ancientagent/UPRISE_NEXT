# Webapp UI Audit Report

- **Repo URL/Branch:** `(unknown)/main`
- **Commit SHA Scanned:** `a83b649b0d8977854db9f0594e0c8b00fa9d74fe`
- **Analysis Timestamp (UTC):** `2025-09-02 22:07:00Z`

---

## 1. Summary

This report covers the `webapp_ui` repository, a React-based frontend application.

- **Framework:** React 19.1.0
- **Build Tool:** Vite 7.0.4
- **Language:** TypeScript 5.8.3
- **State Management:** Redux Toolkit 2.8.2
- **Routing:** React Router 7.6.3
- **Styling:** Inline CSS and standard CSS files. No component library or CSS framework like Tailwind is used.
- **Linting/Testing:** ESLint, Vitest.

### How to Run/Build

- **Node Version:** Not specified. Recommend pinning to a stable LTS version (e.g., 20.x).
- **Install Dependencies:** `npm install`
- **Run Locally (Dev):** `npm run dev`
- **Build for Production:** `npm run build`
- **Run Tests:** `npm run test`

### Environment Variables

The application requires a `.env` file with the following variables (see `.env.example`):

- `VITE_API_BASE_URL`: The base URL for the backend API.
- `VITE_CLIENT_ID`: A client ID for API authentication.
- `VITE_CLIENT_SECRET`: A client secret for API authentication. **(Critical Security Risk)**

---

## 2. Architecture & Data Flow

The `webapp_ui` is a pure client-side application. It does **not** interact directly with Firebase services. Instead, it communicates with a custom backend API for all data, authentication, and business logic.

### Authentication

- Authentication is handled via a custom email/password flow against the backend API (`/auth/login`, `/auth/signup`).
- Upon login, a JWT is returned and stored in the browser's `localStorage`.
- This token is sent with subsequent requests to authenticated endpoints.
- All API requests, including login, send a `client-id` and `client-secret` in the headers.

### High-Level Data Flow (ASCII Diagram)

```
+------------------+      /login, /signup      +-------------------+
|                  |--------------------------->|                   |
|   React Client   | (with Client ID/Secret)    |    Backend API    |      +----------------+
|   (Browser)      |<---------------------------| (VITE_API_BASE_URL) |----->|                |
| (webapp_ui)      |      JWT (on login)        |                   |      | Firebase       |
|                  |                            +-------------------+      | Services       |
+------------------+                                                       | (Firestore, etc.)|
        |                                                                 +----------------+
        | (Authenticated Requests with JWT)
        |
        v
+------------------+      /bands, /events      +-------------------+
|   React Client   |--------------------------->|                   |
|   (Authenticated)|                            |    Backend API    |
+------------------+                            +-------------------+
```

---

## 3. Risks, Gaps, and Quick Wins

### Critical Risks

1.  **Exposed Client Secret (CRITICAL):** The `VITE_CLIENT_SECRET` is bundled with the frontend JavaScript. It is present in `.env.example`, hardcoded as a fallback in `src/api/api.ts`, and also in `src/config.ts`. This allows anyone to impersonate the client application, a severe security vulnerability.
    - **Quick Win:** Immediately revoke the exposed secret. The backend authentication should be refactored to not require a client secret from a public client like a web app. Use a secure auth flow like Authorization Code with PKCE.

### Other Risks & Gaps

2.  **No Pinned Node.js Version:** The project lacks a `.nvmrc` or `package.json#engines` field, leading to potential "works on my machine" issues.
    - **Quick Win:** Add an `.nvmrc` file with a current LTS version (e.g., `lts/iron` or `20.11.1`).
3.  **Lack of Project-Specific Documentation:** The `README.md` is the generic Vite template and contains no information about the project's purpose, architecture, or setup.
    - **Quick Win:** Update the `README.md` with the information from this audit.
4.  **No CI/CD Pipeline:** There is no `.github` directory or other CI configuration. Builds, tests, and deployments are likely manual, which is slow and error-prone.
    - **Quick Win:** Add a basic GitHub Actions workflow to run `npm install`, `npm run lint`, and `npm run test` on every push/PR.
5.  **Inconsistent Dependency Usage:** The project includes `jwt-decode` as a dependency but uses a manual, less robust implementation in `src/utils/authUtils.ts` for token validation.
    - **Quick Win:** Refactor `isTokenValid` to use the `jwt-decode` library to simplify the code and improve reliability.

### Dead Code

- The file `src/config.ts` appears to be dead code. The values it contains are also read from environment variables or have fallbacks in `src/api/api.ts`. This file should be removed to avoid confusion.
