# RFShop Scheduler

A React web app for managing RF cable assembly orders, build planning, parts tracking, and batch/repeat order scheduling. Reads from and writes to Airtable (SALES base).

## Tech Stack

- React 19 + TypeScript (strict) + Vite + Tailwind CSS v3
- No backend — browser talks directly to Airtable REST API
- Auth via Airtable Personal Access Token (stored in localStorage)
- Deployed as static files on Vercel

## Getting Started

```bash
npm install
npm run dev        # Dev server at http://localhost:5173
```

You'll need an Airtable Personal Access Token with read/write access to the SALES base. Create one at [airtable.com/create/tokens](https://airtable.com/create/tokens).

## Commands

```bash
npm run dev        # Start dev server (HMR enabled)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

## Architecture

```
src/
  components/     # React components (one per file)
  lib/            # API client, context, constants, utilities
  types/          # TypeScript type definitions for Airtable records
  App.tsx         # Main app: auth, navigation, data loading
```

All data lives in Airtable. The app is stateless — it fetches data on load and writes changes back via the Airtable REST API.

## Related Project

[XeroAirtableSync](../XeroAirtableSync/) — Python scripts that sync Xero quotes into Airtable and parse assembly codes. This app reads the data those scripts create.

## Build Phases

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Project scaffold, auth, app shell, basic orders list | Done |
| 2 | Full Orders Dashboard (filters, expand, inline edit) | Next |
| 3 | Parts & Stock (aggregated parts, stock check-off) | Planned |
| 4 | Batch Orders (delivery schedule, progress tracking) | Planned |
| 5 | Build Planner (weekly schedule, capacity) | Planned |
| 6 | Polish & Migration | Planned |

## Windows Note

If `npm install` installs Linux bindings instead of Windows ones, check `npm config get os` — it should return `null`, not `linux`. Fix with `npm config delete os`.
