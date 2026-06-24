# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

Three independent workspaces:

- **Root** — TypeSpec API contract (`main.tsp`) compiled to OpenAPI 3 spec
- **`frontend/`** — React 19 booking app (Vite + Mantine + TanStack Query)
- **`backend/`** — Express/TypeScript API server (in-memory store, port 4010)

## Commands

### Root (TypeSpec)
```bash
npm run compile          # compile main.tsp → tsp-output/@typespec/openapi3/openapi.yaml
```

### Frontend (`cd frontend`)
```bash
npm run dev              # Vite dev server (port 5173/5174)
npm run build            # tsc + vite build
npm run lint             # eslint
npm run mock             # Prism mock server from OpenAPI spec on port 4010
```

### Backend (`cd backend`)
```bash
npm run dev              # tsx watch (hot reload) on port 4010
npm run build            # tsc → dist/
npm run start            # run compiled dist/index.js
```

## Architecture

### API Contract Flow
`main.tsp` (TypeSpec) → `npm run compile` → `tsp-output/@typespec/openapi3/openapi.yaml` → Prism mock OR real backend

The OpenAPI spec is the source of truth. Backend types in `backend/src/types.ts` mirror the TypeSpec models manually.

### Backend
- **Port 4010** — Express app with CORS allowing `localhost:5173` and `5174`
- **In-memory store** — `backend/src/store.ts` holds owner, eventTypes, bookings arrays (resets on restart)
- Routes: `GET /owner`, `GET /event-types`, `POST /event-types`, `GET /event-types/:id/slots`, `POST /bookings`, `GET /bookings/upcoming`
- Slot generation is timezone-aware (owner timezone: `Europe/Moscow`) using dayjs

### Frontend
- **API layer** — `frontend/src/api/` — axios client (`baseURL: VITE_API_URL || http://localhost:4010`), one file per resource
- **Hooks** — `frontend/src/hooks/` — TanStack Query wrappers; `useSlots` invalidates after booking creation
- **Pages** — `Home` → `Catalog` (`/book`) → `Book` (`/book/:eventTypeId`) → `Confirmation` → `Admin`
- **UI** — Mantine v9 components; theme in `frontend/src/theme.ts`; Russian-language UI

### Key data flow
1. Guest picks event type on `/book` → selects date/time on `/book/:eventTypeId` → submits form → POST `/bookings` → `/book/:eventTypeId/confirm`
2. Admin at `/admin` sees upcoming bookings and can manage event types

## Environment

`frontend/.env.development` sets `VITE_API_URL=http://localhost:4010`. To use Prism mock instead of the real backend, run `npm run mock` from `frontend/`.
