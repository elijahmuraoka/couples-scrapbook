# Known Issues & Safety Rules

## Regression Risks

1. **BookViewer is used by BOTH preview page and scrapbook viewer.** Any change to book-viewer/index.tsx affects both. Test both paths.
2. **react-pageflip has quirks with usePortrait.** In portrait mode, onFlip reports individual page indices (0,1,2,3...). In spread mode, it also reports individual page indices but pages display in pairs. Dot navigation math must account for this.
3. **Existing scrapbooks in Supabase store `music_id` as a string matching a preset ID.** The custom music feature adds `custom_music_url` — these are independent columns. A scrapbook with `music_id` set must still work. Never remove or rename `music_id`.
4. **MusicPlayer currently requires `songId: string`.** When adding optional `src` prop, make `songId` optional too (`songId?: string`). Guard the Audio creation: if neither songId nor src, don't create an Audio object.
5. **preview/page.tsx uses blob URLs.** After replacing base64 with Uint8Array, the blob URL fetch → arrayBuffer path must still work. Blob URLs are valid fetch targets.
6. **The `customMusicFile` field in ScrapbookDraft is a `File` object.** Zustand persists state in memory (not localStorage). `File` objects are fine in memory but NOT serializable. Do not add persist middleware to this store.

## Build Rules

- Always run `pnpm build` after changes. The project uses strict TypeScript.
- `pnpm lint` should show 0 errors (warnings for `no-explicit-any` are OK).
- Never commit if build fails.

## Branch Rules

- All work on `design-audit` branch until Phase 6 (merge).
- `main` should not be touched until the merge phase.
- After merge: do NOT delete design-audit branch (keep for rollback).

## Supabase Notes

- Migrations are applied automatically via `node scripts/run-migrations.js` which connects directly to the DB using `SUPABASE_DB_URL` from `.env`. The script is idempotent — already-applied migrations are safely skipped ("already exists" errors).
- `pg` is a devDependency used only by the migration runner script.
- The `photos` storage bucket is used for both photos AND custom music files (music/ prefix).

## Testing Checklist (for audit cron)

After all code changes, verify:
- [ ] `pnpm build` — 0 errors
- [ ] `pnpm lint` — 0 errors
- [ ] Font: grep for Petit_Formal_Script in layout.tsx
- [ ] Music: grep for `loop = true` in music-player/index.tsx
- [ ] Upload: no `Buffer.from` or `FileReader` in preview/page.tsx
- [ ] DELETE: export function DELETE in route.ts
- [ ] Responsive: `usePortrait={isPortrait}` (not `usePortrait={true}`) in book-viewer
- [ ] Dead state: no `orientations` state in book-viewer
- [ ] Custom music: 003_custom_music.sql exists
- [ ] No `import { Buffer }` anywhere in client code
