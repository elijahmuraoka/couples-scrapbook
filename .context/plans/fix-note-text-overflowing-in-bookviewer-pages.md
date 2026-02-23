# Fix: Note text overflowing in BookViewer pages

## Context
Long notes (up to 1000 chars) overflow past the bottom of react-pageflip pages and get cut off. Three attempts at fixing this via CSS (flex constraints, absolute positioning, scrolling) all failed because:
- **Scrolling is impossible**: page-flip intercepts touch/swipe events for page turning, making scroll inside pages non-functional
- **CSS height chains break**: page-flip overwrites each page's `style.cssText` entirely on every render frame, so inline styles can't be relied on
- **Character-count font sizing is unreliable**: doesn't account for rendered height, word widths, line breaks, or varying page dimensions across viewports

## Approach: Auto-fit text via ResizeObserver + binary search

Instead of guessing font size from character count, **measure the actual container and adjust font size until the text fits**. This is reliable at every viewport size and note length.

### How it works
1. A `ResizeObserver` detects when page-flip sets the page container's pixel dimensions
2. Binary search finds the largest font size (between 6-22px) where the text's `scrollHeight` fits within the container's `clientHeight`
3. Converges in ~7 iterations (<2ms), re-runs on resize

### Files to change

**New file: `src/components/book-viewer/auto-fit-text.tsx`**
- ~40-line component: takes `text`, `className`, `minFontSize`, `maxFontSize`
- Uses `containerRef` + `textRef` + `ResizeObserver`
- Binary search measures actual rendered text height against container height
- Text starts at `opacity: 0`, fades in once font size is determined (prevents flash)
- Includes `document.fonts.ready` guard so measurement runs after custom font (Petit Formal Script) loads

**Modify: `src/components/book-viewer/index.tsx`**
- Replace the note page section (lines ~146-175)
- Remove the character-count `cn()` conditional font sizing
- Restructure layout: outer page → `absolute inset-0` flex column → washi tape (flex-shrink-0) → white card (flex-1 min-h-0) containing `AutoFitText` → heart icon (flex-shrink-0)
- The `absolute inset-0` container inherits the explicit pixel dimensions from `.stf__item`, giving the flex children a real height to constrain against

**Keep: `src/app/globals.css`**
- `.stf__item { overflow: hidden }` stays as a safety net to clip during the brief moment before font size is calculated

### Why not other approaches
- **Multi-page splitting**: Adds complexity (split points, page count changes, orphaned words) for minimal benefit
- **CSS clamp/container queries**: Container queries use `cqw` units which are width-based, not height-based — doesn't solve vertical overflow
- **Truncation**: Loses user content

## Verification
1. Create a test scrapbook with a short note (~50 chars) — should render at large font size
2. Create one with a long note (~800-1000 chars) — should render at smaller but readable font size
3. Resize browser window — text should re-fit smoothly
4. Test on mobile viewport (280px wide) — text should still fit and be readable
5. Run `npx tsc --noEmit` — zero type errors
