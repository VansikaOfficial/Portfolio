# Portfolio CMS

A production-ready **Portfolio CMS** — a public portfolio site backed by a private, JWT-protected admin dashboard with full CRUD over every section. Built as a reusable product: swap the seed data, theme tokens, and branding to re-skin it for a different client.

```
portfolio-cms/
├── backend/     Express + TypeScript + TypeORM + PostgreSQL REST API
├── frontend/    Next.js 14 (App Router) + TypeScript + MUI public site + admin dashboard
└── README.md    (this file)
```

## 1. Architecture

| Layer | Stack |
|---|---|
| Public site | Next.js 14 App Router, MUI, Framer Motion, React Query, Axios |
| Admin dashboard | Same Next.js app under `/admin`, protected by JWT, React Hook Form + Zod, SweetAlert2 |
| API | Express, TypeScript (strict), TypeORM, Zod validation, Winston logging, Helmet, rate limiting |
| Database | PostgreSQL (local for dev, [Neon](https://neon.tech) for production) — 15 tables |
| Auth | JWT access token (15 min) + bcrypt-hashed refresh token (30 days), single admin account, no registration |
| File storage | Local disk (`backend/uploads/`) for dev, or Cloudinary for production (toggle via `STORAGE_DRIVER`) |

There is **one admin account**, created by the database seeder — not through a signup form. The public site and admin dashboard are two halves of the same Next.js app: everything under `/admin` is a separate route tree with its own layout, auth guard, and navigation.

## 2. Folder structure

```
backend/src/
  config/        env, TypeORM data-source, winston logger
  entities/      15 TypeORM entities
  migrations/    initial schema migration
  seeds/         admin user + sample content seeder
  middlewares/   auth (JWT), error handling, multer upload, rate limiting, zod validation
  validations/   Zod schemas per module
  services/      business logic (+ a generic CRUD service factory for simple modules)
  controllers/   request handlers (+ a generic CRUD controller factory)
  routes/        Express routers, one per module, mounted in routes/index.ts
  utils/         ApiError, ApiResponse, JWT helpers, storage abstraction (local/Cloudinary)
  app.ts         Express app wiring
  server.ts      bootstrap + graceful shutdown

frontend/src/
  app/(public)/  all public pages, share Header/Footer via layout.tsx
  app/admin/     login + protected dashboard, own sidebar/topbar layout
  components/    layout, home, cards, shared UI, admin-specific UI
  config/        nav config, admin nav config, services/achievements content
  hooks/         React Query hooks (public + admin), auth context, generic CRUD hook
  lib/           axios client (with auto token refresh), API functions, validations
  theme/         design tokens, MUI theme factory, providers
  types/         shared TypeScript types mirroring backend entities
```

## 3. Local setup

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or a free [Neon](https://neon.tech) database)

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` — at minimum set `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (use `openssl rand -hex 32`), and either local `DB_*` vars or a Neon `DATABASE_URL` (+ `DB_SSL=true`). Set `ADMIN_EMAIL` / `ADMIN_PASSWORD` — this becomes your only admin login.

```bash
npm run migration:run
npm run seed
npm run dev
```

API runs at `http://localhost:5000/api/v1` (health check: `/api/v1/health`).

### Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

Site runs at `http://localhost:3000`. Admin dashboard: `http://localhost:3000/admin/login`, using the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in the backend `.env`.

Full details (env var reference, script list, module structure) live in `backend/README.md` and `frontend/README.md`.

## 4. Database

15 tables: `users`, `about`, `skills`, `projects`, `education`, `experience`, `internships`, `certificates`, `gallery`, `messages`, `blogs`, `testimonials`, `settings`, `social_links`, `resume`.

```bash
npm run migration:run      # apply schema
npm run migration:revert   # roll back last migration
npm run seed                # admin user + sample content
```

The seeder is idempotent — safe to re-run; it skips anything that already exists.

## 5. Deployment guide

### 5.1 Database — Neon PostgreSQL

1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string (it looks like `postgresql://user:pass@ep-xxxx.neon.tech/dbname?sslmode=require`).
3. You'll paste this into the backend's `DATABASE_URL` on Render.

### 5.2 Backend — Render

1. Push this repo to GitHub.
2. On [Render](https://render.com), create a **Web Service**, pointing at the `backend/` directory.
3. Build command: `npm install && npm run build`
4. Start command: `npm start`
5. Environment variables (Render dashboard → Environment):
   - `NODE_ENV=production`
   - `DATABASE_URL` = your Neon connection string
   - `DB_SSL=true`
   - `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` (strong random values)
   - `ADMIN_EMAIL`, `ADMIN_PASSWORD`
   - `CLIENT_URL` = your deployed frontend URL (for CORS), e.g. `https://your-portfolio.vercel.app`
   - `STORAGE_DRIVER=cloudinary` + `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` — **strongly recommended**, since Render's filesystem is ephemeral and `STORAGE_DRIVER=local` will lose uploaded files on every redeploy.
6. After the first deploy, run migrations and seed once via Render's Shell tab (or a one-off job):
   ```bash
   npm run migration:run
   npm run seed
   ```

### 5.3 Frontend — Vercel

1. On [Vercel](https://vercel.com), import the repo, set the root directory to `frontend/`.
2. Environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api/v1`
   - `NEXT_PUBLIC_UPLOADS_URL` = `https://your-backend.onrender.com` (ignored if using Cloudinary — the API already returns full URLs)
   - `NEXT_PUBLIC_SITE_URL` = `https://your-portfolio.vercel.app`
3. Deploy. Vercel auto-detects Next.js — no extra build config needed.
4. Once both are live, update the backend's `CLIENT_URL` env var on Render to match the final Vercel URL and redeploy the backend so CORS allows it.

### 5.4 Post-deploy checklist

- [ ] Visit `/api/v1/health` on the Render URL — should return `{ success: true }`
- [ ] Visit the Vercel URL — Home page should load with seeded content
- [ ] Log into `/admin/login` with your seeded admin credentials
- [ ] Upload a test image (e.g. a certificate) and confirm it persists after a Render redeploy (validates Cloudinary is wired correctly)
- [ ] Submit the public contact form and confirm it appears in the admin Messages inbox
- [ ] Change the admin password from the dashboard and confirm re-login works

## 6. Security notes

- Only one admin account exists; there is no public registration endpoint.
- Access tokens expire in 15 minutes; the frontend's axios client automatically refreshes them using the stored refresh token and retries the failed request.
- Passwords are hashed with bcrypt; refresh tokens are also bcrypt-hashed before being stored, so a leaked database dump doesn't directly expose usable tokens.
- Helmet, CORS (locked to `CLIENT_URL`), and rate limiting (general + stricter auth/contact-form limits) are enabled by default.
- All admin-mutating routes require a valid JWT with the `admin` role; public routes are read-only except the contact form.

## 7. Extending this project

- **Add a new content type**: create a TypeORM entity, add it to `data-source.ts`, write a migration, add a Zod schema, then either reuse the generic CRUD service/controller factories (for simple modules) or write a custom service like `project.service.ts` (for anything needing slugs, file uploads, or business logic). Mirror it on the frontend with a type in `types/index.ts`, a hook in `usePublicData.ts`, and an admin page under `app/admin/dashboard/`.
- **Re-skin for a new client**: edit `frontend/src/theme/tokens.ts` for colors/fonts, re-run the backend seeder with different `ADMIN_*` env values and edit seed content in `backend/src/seeds/seed.ts`, and update `frontend/src/config/services.ts` / `achievements.ts`.
- **Docker**: see `docker-compose.yml` for a one-command local Postgres + backend + frontend stack (optional — not required for the Vercel/Render/Neon deployment path above).
