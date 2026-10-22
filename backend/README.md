# Portfolio CMS — Backend

Express + TypeScript + TypeORM + PostgreSQL REST API powering the Portfolio CMS.

## Tech Stack

Node.js · Express · TypeScript (strict) · TypeORM · PostgreSQL · JWT · bcrypt · Multer · Helmet · CORS · Winston · Zod

## 1. Prerequisites

- Node.js 18+
- PostgreSQL 14+ (local) or a [Neon](https://neon.tech) database (production)

## 2. Setup

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:

- For **local Postgres**: set `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_NAME`, leave `DATABASE_URL` empty.
- For **Neon**: set `DATABASE_URL` to your Neon connection string and `DB_SSL=true`.
- Set strong random values for `JWT_ACCESS_SECRET` and `JWT_REFRESH_SECRET` (e.g. `openssl rand -hex 32`).
- Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` — this becomes the **only** admin account, created by the seeder.

## 3. Run migrations & seed

```bash
npm run migration:run
npm run seed
```

The seeder creates:
- The single admin user
- Default About / Settings / Resume singleton rows
- Sample social links, skills, projects, education, and experience
- Two sample certificates with a placeholder image (replace via the dashboard)

## 4. Run the dev server

```bash
npm run dev
```

API available at `http://localhost:5000/api/v1` (health check: `/api/v1/health`).

## 5. Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled build |
| `npm run migration:generate -- src/migrations/Name` | Generate a migration from entity changes |
| `npm run migration:run` | Apply pending migrations |
| `npm run migration:revert` | Roll back the last migration |
| `npm run seed` | Seed the database |

## 6. Authentication

- `POST /api/v1/auth/login` → `{ accessToken, refreshToken, user }`
- Access token: 15 minutes (send as `Authorization: Bearer <token>`)
- Refresh token: 30 days, hashed with bcrypt and stored on the user row
- `POST /api/v1/auth/refresh` → rotates both tokens
- `POST /api/v1/auth/logout` → clears the stored refresh token
- There is **no registration endpoint** — only one admin account exists, created by the seeder.

## 7. File uploads

Controlled by `STORAGE_DRIVER` in `.env`:

- `local` (default): files saved to `backend/uploads/`, served at `/uploads/<filename>`. Simple for local dev, but **files are lost on redeploy on platforms like Render** (ephemeral filesystem).
- `cloudinary`: set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`. Recommended for production — files persist across deploys and are served from Cloudinary's CDN. The database always stores just the resulting path/URL, so switching drivers doesn't change any API contracts.

## 8. Project structure

```
src/
  config/        # env, database, logger
  entities/      # TypeORM entities (15 tables)
  migrations/    # SQL migrations
  seeds/         # database seeder
  middlewares/   # auth, error handling, upload, rate limiting, validation
  validations/   # Zod schemas
  services/      # business logic
  controllers/   # request handlers
  routes/        # Express routers
  utils/         # ApiError, ApiResponse, JWT helpers, storage abstraction
  app.ts         # Express app wiring
  server.ts      # bootstrap + graceful shutdown
```

## 9. Deployment (Render + Neon)

See the root [`README.md`](../README.md) for the full deployment guide covering Render, Vercel, and Neon.
