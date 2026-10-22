# Portfolio CMS — Frontend (Public Portfolio)

Next.js 14 (App Router) + TypeScript + MUI + Framer Motion public-facing site.

## 1. Setup

```bash
cd frontend
npm install
cp .env.example .env.local
```

Edit `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
NEXT_PUBLIC_UPLOADS_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`NEXT_PUBLIC_UPLOADS_URL` is only used to resolve local `/uploads/..` paths returned by the backend. If the backend is configured with `STORAGE_DRIVER=cloudinary`, the API already returns full `https://res.cloudinary.com/...` URLs and this variable is ignored for those images.

## 2. Run

```bash
npm run dev
```

Visit `http://localhost:3000`. Make sure the backend is running first (see `../backend/README.md`) — every page fetches live data from the API via React Query.

## 3. Design system

- **Identity**: a data professional's portfolio — deep navy base, teal "signal" accent, amber "insight" accent.
- **Type**: Fraunces (display) + Inter (body) + JetBrains Mono (labels/metrics/code).
- **Theme**: light/dark, toggled in the header, persisted to `localStorage`.
- Tokens live in `src/theme/tokens.ts`; the MUI theme is built in `src/theme/createAppTheme.ts`.

## 4. Structure

```
src/
  app/
    (public)/        # all public-facing pages, share Header/Footer via layout.tsx
    not-found.tsx     # global 404
    robots.ts          # dynamic robots.txt
    sitemap.ts          # dynamic sitemap.xml (includes live projects/blogs)
    layout.tsx           # root layout: fonts, providers
  components/
    layout/            # Header, Footer
    home/               # hero + home-page sections
    cards/              # ProjectCard, SkillBar, TestimonialCard
    shared/             # Section, Reveal, Lightbox, TimelineList, etc.
  config/               # nav.ts, services.ts, achievements.ts
  hooks/                # React Query hooks (usePublicData.ts)
  lib/                  # axios client, API functions, validations
  theme/                # design tokens, MUI theme, providers
  types/                # shared TypeScript types mirroring backend entities
```

## 5. Content sourcing

Every page except **Services**, **Achievements**, and **Privacy Policy** is fully database-driven through the backend API (matching the 15-table schema). Services and Achievements are config-driven (`src/config/services.ts`, `src/config/achievements.ts`) rather than admin-managed — edit those files directly to customize per client, or extend the backend with matching tables/endpoints if you want them admin-editable too.

## 6. Build

```bash
npm run build
npm start
```

## 7. Deployment (Vercel)

See the root [`README.md`](../README.md) for the full deployment guide.
