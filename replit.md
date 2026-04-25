# Stadium Eats

## Overview

PWA food delivery platform for FIFA World Cup Morocco 2030. Three roles:
- **Fans** scan their seat ticket QR and order food delivered to their seat.
- **Riders** pick up and deliver orders inside the stadium.
- **Admins** manage stands, orders, riders, promos, and live ops per stadium.

Mobile-first, i18n (EN/FR/AR-RTL/ES), Moroccan green/red/gold theme, real-time orders.

## Demo Credentials

- Fan ticket QR: `DEMO-CASA-A-12-15` (also a "Use demo ticket" button on splash)
- Admin: `admin@stadiumeats.ma` / `admin2030` (Casablanca), `marrakech@stadiumeats.ma` / `admin2030` (Marrakech)
- Rider PIN: `1234`–`1239`

## Stack

- **Monorepo**: pnpm workspaces, TypeScript 5.9, Node 24
- **Frontend** (`artifacts/stadium-eats`): React 19 + Vite, wouter, TanStack Query, Tailwind v4, framer-motion, lucide, recharts, sonner, shadcn/ui, zustand (persisted), react-i18next
- **Backend** (`artifacts/api-server`): Express 5, Drizzle ORM, Pino, zod
- **Database**: PostgreSQL (Neon-managed via `DATABASE_URL`)
- **API codegen**: Orval from OpenAPI spec → `@workspace/api-client-react` (hooks + types) and `@workspace/api-zod`

## Architecture

- API spec: `lib/api-spec/src/openapi.json` → generates client hooks (`useGetSession`, etc.) and zod schemas
- DB schema: `lib/db/src/schema/` (stadiums, stands, menuItems, fan_sessions, riders, admins, orders, notifications_log, halftime_promos, matches), all re-exported from `index.ts`
- Backend routes: `artifacts/api-server/src/routes/` (session, stand, order, rider, admin, feed)
- Wait-time + effective-status logic: `artifacts/api-server/src/lib/wait.ts`
- QR parsing helper: `lib/qrcodes.ts` (handles `DEMO-CASA-A-12-15` shortcut)
- Seed script: `scripts/src/seed.ts` (2 stadiums, 5 stands × 10 items, 6 riders, 2 admins, live matches, 28 sample orders, demo fan sessions)
- Frontend client store: `artifacts/stadium-eats/src/lib/store.ts` — persisted zustand storing `fanSessionId`, `riderId`, `adminId` (the admin's stadiumId, used by all admin endpoints)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/scripts run seed` — re-seed demo data

## Workflows

- `artifacts/api-server: API Server` — Express API on `PORT`
- `artifacts/stadium-eats: web` — Vite dev server for the PWA
- `artifacts/mockup-sandbox: Component Preview Server` — design sandbox

Restart `artifacts/stadium-eats: web` after frontend changes.

## Conventions

- All TanStack Query hook calls must pass `queryKey` from the matching `getXxxQueryKey(...)` helper alongside `enabled`/`refetchInterval` (the generated types require it).
- Frontend assets live in `artifacts/stadium-eats/public/assets/{stands,menu}/`. Image cards have `onError` fallbacks to `tagine.png` (menu) and `moroccan.png` (stands).
- See the `pnpm-workspace` skill for workspace structure and package details.
