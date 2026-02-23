# Fix build error + medium-priority architectural cleanup

## Context
The Vercel deployment failed because `cn` is imported but unused in `book-viewer/index.tsx` (ESLint error, not just a warning). Additionally, the codebase has several architectural issues (3 duplicate Supabase clients, type mismatches, dead code) that should be cleaned up while we're in here.

## Changes (in order)

### 1. Fix build error: unused `cn` import
**File**: `src/components/book-viewer/index.tsx`
- Remove `import { cn } from '@/lib/utils';` (no longer used after caption refactor)

### 2. Consolidate Supabase clients (3 → 2)
**Delete**: `src/lib/supabase.ts` (the raw `createClient` — redundant with the SSR-aware clients)

**Update imports**:
- `src/app/(home)/components/scrapbook-access.tsx`: change `from '@/lib/supabase'` → `from '@/lib/supabase/client'` (client component, browser context)
- `src/app/api/scrapbooks/route.ts` POST handler: replace `import { supabase } from '@/lib/supabase'` with `await createClient()` from `@/lib/supabase/server'` (already imported but unused in POST). Remove the raw supabase import entirely.

**Keep as-is**:
- `src/lib/supabase/client.ts` — browser SSR client (used by `preview/page.tsx`, `scrapbook-access.tsx`)
- `src/lib/supabase/server.ts` — server SSR client (used by API route)

### 3. Fix Database types to match actual schema
**File**: `src/types/supabase.ts`
- Rename `song_id` → `music_id` in Row, Insert, and Update types
- Remove `photos: Json` from the scrapbooks table type (photos is a separate table, not a JSON column)
- Add a `photos` table definition with columns: `id`, `scrapbook_id`, `url`, `order`, `caption`, `location`, `taken_at`, `created_at`

### 4. Replace server self-fetch with direct Supabase call
**File**: `src/app/scrapbook/[code]/page.tsx`
- Replace `fetch(\`${process.env.NEXT_PUBLIC_APP_URL}/api/scrapbooks?code=${code}\`)` with a direct `createClient()` call from `@/lib/supabase/server`
- Use `supabase.from('scrapbooks').select('*, photos(*)').eq('code', code).single()`
- This removes the dependency on `NEXT_PUBLIC_APP_URL` being set correctly and eliminates the unnecessary network hop

### 5. Fix font conflict
**File**: `src/app/globals.css`
- Remove the `body { font-family: Arial, Helvetica, sans-serif; }` rule (lines 5-7)
- The `Inter` font from `next/font/google` in `layout.tsx` already handles body font via className

### 6. Remove dead code
**Delete**: `src/app/create/components/create-header.tsx` (never imported anywhere)

## Files summary
| File | Action |
|------|--------|
| `src/components/book-viewer/index.tsx` | Remove unused `cn` import |
| `src/lib/supabase.ts` | Delete |
| `src/app/(home)/components/scrapbook-access.tsx` | Update import path |
| `src/app/api/scrapbooks/route.ts` | Use server client consistently |
| `src/types/supabase.ts` | Fix column names, add photos table |
| `src/app/scrapbook/[code]/page.tsx` | Direct Supabase call instead of self-fetch |
| `src/app/globals.css` | Remove Arial font override |
| `src/app/create/components/create-header.tsx` | Delete |

## Verification
1. `pnpm run build` — must pass (zero ESLint errors)
2. `npx tsc --noEmit` — zero type errors
3. Test locally: create a scrapbook, view it via code — confirms Supabase client changes work
4. Test home page: enter a code — confirms scrapbook-access.tsx client change works
5. Check font renders as Inter, not Arial
