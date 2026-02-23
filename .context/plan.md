# High Priority Fixes - Valentine's Day Sprint

## Objective
Fix the most impactful bugs and UI issues quickly. App is live, deploying from `main`. Dev server running on localhost:3000.

---

## Completed

### 1. Fix file size filter no-op (`photo-upload.tsx`) - DONE
- Assigned filter result to `validFiles`, used it downstream
- Moved the "max 10 photos" check to after filtering so valid count is accurate
- Swapped `alert()` to `toast.error()` for consistency

### 2. Fix image preload race condition (`book-viewer/index.tsx`) - DONE
- Removed the `imagesLoaded` counter and its useEffect entirely
- Consolidated into single `Promise.all` approach with cancellation support
- Removed all debug `console.log` statements
- Gracefully handles failed image loads (still shows book)
- Added cleanup with `cancelled` flag to prevent state updates on unmounted components

### 3. Remove ignored route config (`preview/page.tsx`) - DONE
- Removed `export const dynamic` and `export const runtime` from client component

### 4. Photo page caption overflow (`book-viewer/index.tsx`) - DONE
- Photo pages restructured: `flex-1 min-h-0` on photo, `flex-shrink-0` on caption
- Reduced padding `p-6 md:p-10` (was `p-12`)
- Caption always relative positioned (removed absolute positioning for vertical photos)

### 5. Added `.stf__item { overflow: hidden }` to `globals.css` - DONE
- Clips content at page-flip page boundaries as a safety net

---

## In Progress

### 6. Note page overflow - NOT YET FIXED
**Problem**: Long notes overflow past the page bottom and get clipped.

**Failed approaches (documented in .context/note-overflow-investigation.md):**
1. CSS flex height chain (`h-full`, `flex-1 min-h-0`, `overflow-y-auto`) - doesn't constrain
2. Removed `justify-center`, flattened nesting - same result
3. `absolute inset` positioning - still overflows
4. Character-count font sizing thresholds - unreliable, doesn't account for rendered height

**Root cause**: page-flip sets explicit pixel dimensions via `style.cssText` overwrites. Scrolling conflicts with swipe gestures. Character count doesn't predict rendered height.

**Current state of note page in code**: Has character-count based `cn()` font sizing (thresholds at 200/400/600 chars). Not working reliably.

**Solution (approved plan)**: `AutoFitText` component using ResizeObserver + binary search to measure actual rendered height and find the largest fitting font size. See `/Users/elijahmuraoka/.claude/plans/shimmering-wondering-spark.md` for full details.

---

## Files Modified So Far
- `src/app/create/components/photo-upload.tsx` - file size filter fix
- `src/components/book-viewer/index.tsx` - preload fix, photo page layout, note page (needs AutoFitText)
- `src/app/preview/page.tsx` - removed dead exports
- `src/app/globals.css` - added `.stf__item { overflow: hidden }`
