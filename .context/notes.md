# Couples Scrapbook - Project Notes

## Stack
- Next.js 15 (App Router, Turbopack) + React 19
- Supabase (DB + Storage for photos)
- Zustand (client state for draft scrapbook)
- shadcn/ui (New York style) + Tailwind CSS 3
- react-pageflip (book viewer), dnd-kit (photo reorder), framer-motion
- canvas-confetti, sonner (toasts), exif-js (photo metadata)
- Deployed on Vercel, deploys from `main`

## Architecture
- Home page: enter code to view existing scrapbook, or create new one
- Create flow: title/note -> pick music -> upload photos (up to 10) -> preview -> publish
- Publishing: creates scrapbook record via API route, uploads photos to Supabase Storage, inserts photo records
- Viewing: server component fetches scrapbook by code, renders BookViewer with react-pageflip
- Music: 6 bundled mp3s in /public/music, selectable during creation, plays on view

## Known Bugs (from code review)
1. **File size filter is a no-op** - `photo-upload.tsx:47`: `files.filter(...)` result never assigned
2. **3 duplicate Supabase clients** - `lib/supabase.ts`, `lib/supabase/client.ts`, `lib/supabase/server.ts` - inconsistent usage across API routes
3. **Database type mismatch** - `types/supabase.ts` has `song_id` but API uses `music_id`; has `photos` as Json but actual schema uses a separate photos table
4. **Route config ignored** - `preview/page.tsx` exports `dynamic`/`runtime` in a `'use client'` file (no effect)
5. **Image preload race condition** - `book-viewer/index.tsx`: two competing mechanisms both set `isLoading = false`
6. **Server fetches own API** - `scrapbook/[code]/page.tsx` fetches `NEXT_PUBLIC_APP_URL/api/scrapbooks` instead of calling Supabase directly
7. **Font conflict** - layout loads Inter via next/font but globals.css overrides to Arial
8. **DnD index-based keys** - `selected-photos.tsx` uses `photo-${index}` keys that don't follow items on reorder
9. **Dead code** - `create-header.tsx` is never imported

## Security Concerns
- No auth/authorization on API routes (DELETE especially - anyone with a code can delete)
- No rate limiting on POST (unlimited scrapbook creation)
- Scrapbook code is both "password" and URL path (visible in browser history)
- Potential RLS policy issues on Supabase side (needs verification)

## Env Vars Needed
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`
