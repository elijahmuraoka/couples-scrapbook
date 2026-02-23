# Couples Scrapbook - TODOs

## Priority: HIGH (Valentine's Day - easy wins)

### Bug Fixes
- [x] Fix file size filter no-op in `photo-upload.tsx` (assign filter result to variable)
- [x] Fix image preload race condition in `book-viewer/index.tsx` (remove duplicate loading logic, memoize data)
- [x] Remove ignored route config exports from `preview/page.tsx` (`dynamic`, `runtime`)

### UI/UX - Mobile Issues
- [x] **Notes too long on mobile** - added AutoFitText component with binary-search font sizing
- [ ] **Page loading jank** - transitions between scrapbook pages feel laggy/weird. Investigate react-pageflip loading behavior
- [ ] **General UI polish** - current design feels a bit dated/"AI slop". Small refinements to spacing, typography, and color usage without major redesign

### Suggestions for Quick UI Improvements
- [ ] Tighten up the home page layout (bio card positioning, spacing)
- [x] Make the book viewer note page responsive (smaller text, padding adjustments for mobile)
- [x] Consider limiting note display in book viewer to a max height with scroll/fade (AutoFitText handles this)
- [ ] Improve page turn feedback (loading indicator per-page vs whole-book spinner)

---

## Priority: MEDIUM (Post-Valentine's)

### Architecture Cleanup
- [x] Consolidate Supabase clients (remove `lib/supabase.ts`, use `lib/supabase/client.ts` for browser, `lib/supabase/server.ts` for server)
- [x] Fix Database types in `types/supabase.ts` to match actual schema (`music_id`, separate photos table, Relationships)
- [x] Replace self-fetch in `scrapbook/[code]/page.tsx` with direct Supabase call from server component
- [x] Fix font conflict (removed Arial override, relying on next/font Geist)
- [ ] Fix DnD keys to use stable IDs instead of indices
- [x] Remove dead `create-header.tsx`
- [x] Remove dead GET/DELETE API handlers (scrapbook page queries Supabase directly)
- [x] Update @supabase/ssr 0.5.2 → 0.8.0 (fixes type resolution with supabase-js 2.97)
- [x] Update Next.js 15.1.7 → 15.5.12 (fix Vercel security block)

### Security
- [ ] Verify and fix Supabase RLS policies
- [ ] Add basic rate limiting or abuse protection on API routes
- [ ] Consider separating scrapbook password from URL code

---

## Priority: LOW (Feature Ideas)

### New Features
- [ ] **Custom audio upload** - let users upload their own music/audio file instead of only choosing from preset library
- [ ] User accounts / authentication (optional, for managing scrapbooks)
- [ ] Ability to edit a published scrapbook
- [ ] More music options or integration with external music
- [ ] Social sharing previews (OG image generation)
- [ ] Dark mode support (theme vars exist but unused)
