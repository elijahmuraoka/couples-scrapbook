# Next.js 16 + Tailwind CSS v4 Migration

## Context
The Vercel deployment is failing (prerender error fixed in code but deployment still unstable). Additionally, Vercel flagged a **critical RCE vulnerability** (CVE-2025-66478) in Next.js 15.1.7. Rather than just patching to 15.1.11, we're upgrading to Next.js 16 (latest stable) which resolves all security issues and is the current LTS. This requires also upgrading Tailwind CSS v3 → v4 since Next.js 16 uses Turbopack by default for builds, which is incompatible with Tailwind v3.

## Strategy
**Order: Tailwind v4 first, then Next.js 16.** Upgrading Tailwind first on the stable Next.js 15 base avoids the Turbopack + Tailwind v3 incompatibility. We'll use the automated upgrade tools where possible, then fix what they miss manually.

**Close PR #2** (Vercel's 15.1.11 security patch) since upgrading to Next.js 16 supersedes it.

---

## Phase 1: Tailwind CSS v3 → v4

### Step 1: Run the automated upgrade tool
```bash
npx @tailwindcss/upgrade@latest
```
This handles dependency swaps, PostCSS config, and basic directive migration. Then verify and fix manually.

### Step 2: Swap animation plugin
- Remove `tailwindcss-animate` → install `tw-animate-css`
- Add `@import "tw-animate-css"` to globals.css
- The dialog animations (`animate-in`, `animate-out`, `fade-in-0`, `zoom-in-95`, etc.) use the same class names

### Step 3: Rewrite `postcss.config.mjs`
```js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

### Step 4: Rewrite `globals.css` (the biggest change)

**Replace** `@tailwind base/components/utilities` **with:**
```css
@import "tailwindcss";
@import "tw-animate-css";
```

**Add dark mode variant:**
```css
@custom-variant dark (&:is(.dark *));
```

**Add `@theme inline` block** (replaces `tailwind.config.ts`):
- Map `--color-background: var(--background)` etc. for all shadcn/ui tokens
- Map `--radius-lg/md/sm` from `--radius` variable
- This makes `bg-background`, `text-foreground`, `border-border` etc. work

**Update CSS variables** — values must now include `hsl()` wrapper:
- Before: `--background: 0 0% 100%;`
- After: `--background: hsl(0 0% 100%);`

**Migrate custom classes** from `@layer base` to `@utility`:
- `.font-handwriting` → `@utility font-handwriting { ... }`
- `.bg-cream-paper` → `@utility bg-cream-paper { ... }`
- `.bg-washi-tape` → `@utility bg-washi-tape { ... }`

**Replace `@apply` with plain CSS:**
- `* { @apply border-border; }` → `* { border-color: var(--border); }`
- `body { @apply bg-background text-foreground; }` → `body { background-color: var(--background); color: var(--foreground); }`

**Migrate `@layer utilities`** → `@utility`:
- `.ease-spring` → actually unused, remove it

**Clean up dead animations** (unused in any component):
- Remove: `slideUpAndFade`, `scaleIn`, `spin-slow`/`animate-spin-slow`, `ease-spring`
- Remove: custom `pulse` keyframe (conflicts with Tailwind's built-in `animate-pulse`)
- Keep: `float`/`animate-float` (used in home-hero.tsx)

### Step 5: Delete `tailwind.config.ts`
All config moved to CSS `@theme inline` block. Content detection is automatic in v4.

### Step 6: Fix `dialog.tsx` — `ring-offset-background`
Line 47 uses `ring-offset-background ring-offset-2` which is deprecated in v4.
Replace with: `outline-offset-2 outline-2 outline-ring/70` or the v4-compatible equivalent.

### Step 7: Update `components.json`
Set `"config": ""` (no more JS config file).

---

## Phase 2: Next.js 15 → 16

### Step 1: Run the Next.js codemod
```bash
pnpm dlx @next/codemod@canary upgrade latest
```
This updates `next`, `react`, `react-dom`, types, and migrates the lint script.

### Step 2: Update `package.json` scripts
- `"dev": "next dev"` (remove `--turbopack`, now default)
- `"lint": "eslint ."` (codemod should handle this)

### Step 3: Update `eslint-config-next` to match Next.js 16
```bash
pnpm add -D eslint-config-next@latest
```

### Step 4: Fix ESLint config — remove duplicate rule
`eslint.config.mjs` has `@typescript-eslint/no-explicit-any` listed twice.

### Step 5: No other changes needed
- Async request APIs (`await params`, `await cookies()`) already migrated
- No `middleware.ts` to rename
- No custom webpack config
- `next.config.ts` is minimal and compatible

---

## Phase 3: Verification

### Build check
```bash
pnpm run build
```

### Visual verification (dev server)
- Home page: pink theme colors, floating heart animation
- Book viewer: `font-handwriting`, `bg-cream-paper`, `bg-washi-tape` render correctly
- Dialog: open/close animations work (fade, zoom, slide)
- Gradients: `bg-gradient-to-r from-pink-500 to-rose-500` on buttons
- Loading states: `animate-pulse` on hearts

### Security audit
```bash
pnpm audit
```
Critical Next.js CVEs should be resolved.

### Deploy
Push to branch → Vercel preview deployment should succeed.

---

## Files Modified

| File | Action | Risk |
|------|--------|------|
| `src/app/globals.css` | **Major rewrite** — new imports, @theme, @utility, HSL wrapping | HIGH |
| `tailwind.config.ts` | **Delete** | LOW |
| `postcss.config.mjs` | Swap plugin to `@tailwindcss/postcss` | LOW |
| `package.json` | Update deps and scripts | LOW |
| `components.json` | Remove config path | LOW |
| `eslint.config.mjs` | Remove duplicate rule | LOW |
| `src/components/ui/dialog.tsx` | Fix deprecated `ring-offset-*` | MEDIUM |
