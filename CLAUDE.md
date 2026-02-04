# CLAUDE.md

## Project Overview

RFShop Scheduler v2 — a React web app for managing RF cable assembly orders, build planning, parts tracking, and batch/repeat order scheduling. Reads from and writes to Airtable (SALES base).

## Commands

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # TypeScript check + production build
npm run lint       # ESLint
npm run preview    # Preview production build locally
```

**Important (Windows):** If `npm install` installs Linux bindings instead of Windows ones, check `npm config get os` — it should return `null`, not `linux`. Fix with `npm config delete os`.

## Architecture

- **React 18 + TypeScript + Vite + Tailwind CSS v3**
- **No backend** — browser talks directly to Airtable REST API
- **Auth:** Airtable PAT stored in localStorage
- **All state in Airtable** — app is stateless

### Folder Structure

```
src/
  components/     - React components (one per file)
  lib/            - Shared utilities, API client, context
    airtable.ts   - Airtable API client (pagination, batching, schema)
    constants.ts  - Table IDs, default options, app config
    context.ts    - React context for app-wide state
    utils.ts      - Date, currency, order size utilities
  types/          - TypeScript type definitions
    airtable.ts   - All Airtable record types and enums
  App.tsx         - Main app with auth, navigation, data loading
  main.tsx        - Entry point
  index.css       - Tailwind directives + custom styles
```

### Views

1. **Orders Dashboard** — Active orders table with filters, expandable rows
2. **Parts & Stock** — Aggregated parts across orders, stock check-off (Phase 3)
3. **Build Planner** — Weekly build schedule with capacity (Phase 5)

## Airtable Integration

- **Base ID:** `app2rn4sxcLGg7JiS` (SALES)
- **Quoted table:** `tbldUzgzZoKByIw6P`
- **Quote Parts Requirements:** `tblpHOLE5zHZR1Rul`
- **Quotes Line Items:** `tbl3SQJ6AqAzXXk1L`

See `../XeroAirtableSync/.agent/System/data_schema.md` for full schema.

## Related Project

`../XeroAirtableSync/` — Python scripts that sync Xero quotes into Airtable and parse assembly codes. This app reads the data those scripts create.

## Build Phases

See `../XeroAirtableSync/.agent/Tasks/scheduler-v2-phase0.md` for full plan.
