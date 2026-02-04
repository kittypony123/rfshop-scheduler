# Common Operations

## Development

### Start dev server
```bash
cd C:\Users\frmar\RFShop\rfshop-scheduler
npm run dev
```
Opens at http://localhost:5173. Hot-reloads on file changes.

### Build for production
```bash
npm run build
```
Runs TypeScript check then Vite build. Output in `dist/`.

### Run linter
```bash
npm run lint
```

### Preview production build
```bash
npm run preview
```

## Adding a New Component

1. Create `src/components/MyComponent.tsx`
2. If it needs app data, use `useContext(AppContext)` from `src/lib/context.ts`
3. Import and render in the appropriate parent (usually `App.tsx` for views)
4. All styling via Tailwind utility classes — no CSS files per component

## Adding a New Airtable Field

1. Add the field type to `src/types/airtable.ts` (in the appropriate `*Fields` interface)
2. If it's a single-select, add default options to `DEFAULT_SELECT_OPTIONS` in `src/lib/constants.ts`
3. The `AirtableAPI.loadSchemas()` method will auto-discover select options from the Metadata API

## Adding a New View

1. Create the component in `src/components/`
2. Add the view key to the `View` type in `App.tsx`
3. Add a nav button in the header section of `App.tsx`
4. Add the conditional render in the `<main>` section of `App.tsx`

## Deployment

### GitHub
```bash
git add <files>
git commit -m "Description"
git push origin main
```

### Vercel
Once connected, Vercel auto-deploys on push to `main`. No manual steps needed.

### First-time Vercel Setup
1. Go to vercel.com, sign in with GitHub
2. Import `rfshop-scheduler` repository
3. Vite is auto-detected — click Deploy
4. App available at `rfshop-scheduler.vercel.app`

## Troubleshooting

### npm install fails with native module errors
Check: `npm config get os` — should return `null`, not `linux`.
Fix: `npm config delete os` then reinstall.

### Build fails with type errors
Run `npx tsc --noEmit` to see TypeScript errors without building.

### Airtable 401 errors
Token expired or invalid. Clear localStorage and re-enter token:
- Open browser DevTools → Application → Local Storage → delete `rfshop_airtable_token`

### Schema API unavailable warning
The Metadata API requires specific token scopes. The app falls back to `DEFAULT_SELECT_OPTIONS` in constants.ts. All functionality works — just can't discover new field options dynamically.

## Related Docs

- [Project Architecture](../System/project_architecture.md) — Full tech stack and design decisions
- [Data Schema](../System/data_schema.md) — Airtable tables and fields
