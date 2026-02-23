# Note Page Overflow - RESOLVED

## Root Cause
react-pageflip's `HTMLPage.ts` overwrites each page element's `style.cssText` entirely on every draw, setting explicit pixel `width` and `height` but **never setting `overflow`**. Content that exceeds the page dimensions spills out visually.

Additionally, scrolling inside pages would conflict with page-flip's touch/swipe gesture handling (`touch-action: pan-y` on parent). **Scrolling is not a viable solution for this library.**

## Failed Approaches
1. `h-full` + `flex-1 min-h-0` + `overflow-y-auto` - flex height chain doesn't constrain properly
2. Removed `justify-center`, flattened nesting - same result
3. `absolute inset` positioning - still overflows, and scrolling conflicts with page gestures

## Solution (current)
Two-part fix:
1. **`globals.css`**: Added `.stf__item { overflow: hidden; }` - clips any overflow cleanly at page boundaries
2. **`book-viewer/index.tsx`**: Dynamic font sizing based on note length:
   - 0-200 chars: `text-xs md:text-lg` (original size)
   - 200-400 chars: `text-[10px] md:text-base`
   - 400-600 chars: `text-[9px] md:text-sm`
   - 600+ chars: `text-[8px] md:text-xs`
3. Reverted note page layout back to the simple original structure (no flex/scroll complexity)

## Key Learning
The `page-flip` library (used by `react-pageflip`) manages page elements by overwriting `style.cssText` entirely. Cannot rely on inline styles for overflow control - must use CSS classes/selectors. Scrolling inside pages is not feasible due to gesture conflicts.
