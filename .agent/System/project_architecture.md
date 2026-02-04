# Project Architecture

## Overview

**RFShop Scheduler v2** is a React web application for managing RF cable assembly orders, build planning, parts tracking, and batch/repeat order scheduling. It reads from and writes to Airtable (SALES base).

This is a **full rewrite** of the original `scheduler-app.html` (3,895-line single-file React app in the XeroAirtableSync project). The redesign moves to a proper project structure with TypeScript, Vite, and component-based architecture.

## Tech Stack

| Layer | Technology | Version | Notes |
|-------|-----------|---------|-------|
| UI Framework | React | 19.2 | Functional components, hooks only |
| Language | TypeScript | 5.9 | Strict mode, no `any` types |
| Build Tool | Vite | 6.3 | Fast dev server, production bundler |
| Styling | Tailwind CSS | 3.4 | Utility-first, Inter font |
| Data Store | Airtable | REST API v0 | No backend — browser talks directly to Airtable |
| Auth | Airtable PAT | - | Stored in localStorage |

**No backend server.** The app is fully client-side — static files served from Vercel (or opened locally). All data lives in Airtable.

## File Structure

```
rfshop-scheduler/
  .agent/                   # Documentation (this folder)
  public/                   # Static assets
  src/
    components/             # React components (one per file)
      AuthScreen.tsx        # Login screen with PAT validation
      BuildPlanner.tsx      # Weekly build schedule (Phase 5 placeholder)
      OrdersDashboard.tsx   # Active orders table with badges
      PartsStock.tsx        # Aggregated parts view (Phase 3 placeholder)
      Toast.tsx             # Toast notification system
    lib/                    # Shared utilities and services
      airtable.ts           # Airtable API client (pagination, batching, schema)
      constants.ts          # Table IDs, select options, app defaults
      context.ts            # React Context definition for app state
      utils.ts              # Date, currency, order size helpers
    types/                  # TypeScript type definitions
      airtable.ts           # All Airtable record types and enums
    App.tsx                 # Root component: auth flow, data loading, navigation
    main.tsx                # Entry point (renders App in StrictMode)
    index.css               # Tailwind directives + custom scrollbar/animation styles
  index.html                # HTML shell (loads Inter font)
  vite.config.ts            # Vite configuration
  tailwind.config.js        # Tailwind configuration (Inter font)
  postcss.config.js         # PostCSS plugins
  tsconfig.json             # TypeScript project references
  tsconfig.app.json         # App TypeScript config (strict)
  tsconfig.node.json        # Node config (for vite.config.ts)
  eslint.config.js          # ESLint flat config
  CLAUDE.md                 # AI assistant guidance
```

## Data Flow

```
Xero (manual JSON export)
    |
    v
XeroAirtableSync Python scripts ──> Airtable (SALES base)
    (sync_xero_quotes.py,             |
     parse_quote_parts.py)            |
                                      v
                              rfshop-scheduler (this app)
                              Reads & writes via REST API
                              from the browser
```

### Data Loading Sequence

1. User opens app → check localStorage for token
2. If token exists → `testConnection()` → `loadSchemas()` → `loadData()`
3. `loadData()` fetches 3 tables in sequence:
   - All quotes from Quoted table (client-side filter by status)
   - All build lines from Quote Parts Requirements (grouped by QuoteNumber)
   - All quote line items from Quotes Line Items (grouped by QuoteNumber)
4. Data stored in React state, provided to views via `AppContext`

### Write Operations

- `updateRecord()` — Single record PATCH
- `updateRecordsBatch()` — Batch PATCH (max 10 per request, 250ms delay between batches)
- After saves: full `refreshData()` reload (no optimistic updates yet)

## State Management

**Pattern:** React Context with `useState` hooks in App.tsx.

```
AppContext provides:
  - api: AirtableAPI          (the API client instance)
  - quotes: Quote[]           (all loaded quotes)
  - buildLinesMap: Record<string, BuildLine[]>   (keyed by QuoteNumber)
  - quoteLinesMap: Record<string, QuoteLine[]>   (keyed by QuoteNumber)
  - addToast()                (show notification)
  - refreshData()             (reload all data)
  - loading: boolean          (loading state)
```

No external state library (Redux, Zustand, etc.). Context is sufficient for the current scale.

## Navigation

Tab-based navigation in the header. Three views:

| View | Component | Status | Purpose |
|------|-----------|--------|---------|
| Orders | `OrdersDashboard` | Phase 1 done | Active orders with status/urgency badges |
| Parts & Stock | `PartsStock` | Placeholder | Aggregated parts, stock check-off |
| Build Planner | `BuildPlanner` | Placeholder | Weekly schedule, capacity planning |

No routing library — the `view` state in App.tsx switches between components.

## Authentication

1. User enters Airtable Personal Access Token (PAT) on auth screen
2. App tests connection by fetching 1 record from Quoted table
3. On success: token saved to `localStorage` under key `rfshop_airtable_token`
4. On subsequent visits: auto-connects using stored token
5. Logout: removes token from localStorage, clears all state

## Deployment

- **Target:** Vercel (free tier), auto-deploys from GitHub
- **GitHub repo:** https://github.com/kittypony123/rfshop-scheduler
- **Build output:** `dist/` folder (static HTML + JS + CSS)
- **No environment variables needed** — token entered by user at runtime

## Key Design Decisions

1. **No backend** — Keeps deployment simple. Airtable handles all data storage. Trade-off: token stored client-side in localStorage.
2. **Tailwind v3 (not v4)** — v4 requires native Rust bindings (oxide) that fail on this Windows machine with npm. v3 is stable via PostCSS.
3. **TypeScript strict mode** — Catches bugs early. All Airtable fields are typed.
4. **Client-side filtering** — Fetches all quotes, filters in browser. Works fine at current scale (~20 quotes). May need server-side filtering if data grows significantly.
5. **Full reload on save** — Simpler than optimistic updates. Acceptable latency with current data volume.

## Known Issues

- **npm `os` config:** This machine had `npm config os=linux` set globally (by another tool), causing all native Node.js bindings to fail. Fixed by running `npm config delete os`. If native module errors recur, check this first.

## Related Docs

- [Data Schema](data_schema.md) — Airtable tables, fields, relationships, API patterns
- [SOP: Common Operations](../SOP/common_operations.md) — How to run, develop, deploy
- [Phase 0 Plan](../../..\XeroAirtableSync/.agent/Tasks/scheduler-v2-phase0.md) — Full rebuild plan with all phases
- [XeroAirtableSync Architecture](../../..\XeroAirtableSync/.agent/System/project_architecture.md) — The data pipeline that feeds this app
