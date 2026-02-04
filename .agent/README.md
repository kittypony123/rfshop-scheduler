# .agent Documentation Index

This folder contains structured documentation for the RFShop Scheduler v2 project. Read this file first to understand what documentation is available and where to find it.

## Quick Summary

**RFShop Scheduler v2** is a React + TypeScript web app for managing RF cable assembly orders, build planning, parts/stock tracking, and batch order scheduling. It reads from Airtable (populated by the XeroAirtableSync Python pipeline) and writes scheduling/status data back. No backend — fully client-side, deployed as static files on Vercel.

## Folder Structure

| Folder/File | Purpose |
|---|---|
| `Tasks/` | PRD and implementation plans for each feature |
| `System/` | System architecture, tech stack, data schema |
| `SOP/` | Standard operating procedures and best practices |
| `README.md` | This file — index of all documentation |

## Documentation Files

### System (Architecture & Schema)

| File | What it covers |
|---|---|
| [`System/project_architecture.md`](System/project_architecture.md) | Project goal, file structure, tech stack, data flow, state management, navigation, auth, deployment, design decisions, known issues |
| [`System/data_schema.md`](System/data_schema.md) | Airtable tables and fields (Quoted, Quote Parts Requirements, Quotes Line Items), relationships, API patterns, rate limits, TypeScript types |

### SOP (Standard Operating Procedures)

| File | What it covers |
|---|---|
| [`SOP/common_operations.md`](SOP/common_operations.md) | Running dev server, building, adding components/views/fields, deployment (GitHub + Vercel), troubleshooting (npm, TypeScript, Airtable) |

### Tasks

| File | What it covers |
|---|---|
| *See XeroAirtableSync project* | Phase 0 plan lives at `../XeroAirtableSync/.agent/Tasks/scheduler-v2-phase0.md` |

## How to Use

- **First time?** Read `System/project_architecture.md` for the big picture
- **Need Airtable details?** Check `System/data_schema.md`
- **Need to do something?** Check `SOP/common_operations.md`
- **Planning a feature?** Create a PRD in `Tasks/` and reference relevant System docs
- **After major changes?** Run `/update-doc` in Claude Code to refresh documentation

## Build Phase Status

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Project scaffold, auth, app shell, basic orders list | Done |
| 2 | Full Orders Dashboard (filters, expand, inline edit) | Next |
| 3 | Parts & Stock (aggregated parts, stock check-off) | Planned |
| 4 | Batch Orders (delivery schedule, progress tracking) | Planned |
| 5 | Build Planner (weekly schedule, capacity) | Planned |
| 6 | Polish & Migration | Planned |

## Related Projects

| Project | Location | Relationship |
|---------|----------|-------------|
| XeroAirtableSync | `../XeroAirtableSync/` | Data pipeline — syncs Xero quotes into Airtable, parses assembly codes. This app reads that data. |

## Last Updated

- 4 February 2026 — Initial documentation created (Phase 1 complete)
