# Racqueteer — Change Log

Project: **Racqueteer** (Pickleball & Padel club website)
Client: **Alex Tymoshchenko** (Slack: U09MQMHGJ1Y)
Slack channel: **#alex-personal-project-web-dev**
Source of truth (GitHub): **https://github.com/Slava12212/racqueteer** ← full-stack Next.js + WordPress headless
Local working copy: `projects/racqueteer-fresh/`

> **Rule going forward:** EVERY change made to this project must be appended to this file with date, author (which agent + model), files touched, what changed, and the resulting git commit SHA + push status. No silent edits.

---

### 2026-05-07 — site-developer / MiniMax M2.5
- Files touched: `wp/inc/acf-blocks.php`, `lib/graphql/queries.ts`, `types/wp-blocks.ts`, `components/amenities/amenitiesData.tsx`, `components/amenities/AmenitiesSection.tsx`, `components/blocks/AmenitiesBlock.tsx`, `components/blocks/BlockRenderer.tsx`, `wp/inc/demo-content.php`
- What changed: Added new ACF block `racqueteer-amenities` with label, title, and repeater field for amenities items. Added GraphQL fragment, TypeScript interfaces, refactored AmenitiesSection to accept optional content/amenities props for WP integration. Falls back to hardcoded data when WP repeater is empty. Added to demo-content homepage between Locations and Programs blocks.
- Commit SHA: `658f8fd`
- Push status: ✅ pushed

### 2026-05-07 — site-developer / MiniMax M2.5
- Files touched: `components/ProgramsSection.tsx`, `wp/inc/demo-content.php`, `lib/api.ts`
- What changed: Changed ProgramsSection headline copy to "Discover Our Programs, Coaching, Events, and Clinics". Removed tabs entirely (both desktop and mobile). Moved headline to left side with max-w-[840px] and text-wrap:balance to prevent orphan words. Updated demo-content and api.ts defaults.
- Commit SHA: `658f8fd` (combined with amenities commit)
- Push status: ✅ pushed

---

## Repo map (so we never push to the wrong place again)

| Local folder | Remote | Status |
|---|---|---|
| `projects/racqueteer-fresh/` | `Slava12212/racqueteer.git` (Next.js + WP headless) | ✅ **CORRECT REPO — use this one** |
| `projects/racqueteer-next/` | `Slava12212/Leha.git` (Next.js only, abandoned remote) | ⚠️ Old/wrong remote, do not push to this for Alex's project |
| `projects/racqueteer/` | (no git, vendored snapshot of original Vite+Express version) | 🪦 Reference only — original full-stack codebase |

---

### 2026-04-29 — Responsive min-h-screen (site-developer / MiniMax M2.5)
- Files touched: `app/globals.css`
- What changed: Added CSS media query to remove `min-height: auto !important` for screens below 1024px (lg breakpoint)
- Commit SHA: `9f5ffba`
- Push status: **NOT pushed** — authentication failed (no SSH key / credential helper configured)

### 2026-04-29 — Header navigation (site-developer / MiniMax M2.5)
- Files touched: `components/Navbar.tsx`
- What changed: Changed logo positioning to only center on 2xl+ (1920px+) to prevent overlap with menu at <1600px
- Commit SHA: `b3060fd`
- Push status: **NOT pushed** — authentication failed

### 2026-04-29 — Programming block title overlap (site-developer / MiniMax M2.5)
- Files touched: `components/ProgramsSection.tsx`
- What changed: Reduced title font-size at ≤1280px to prevent title/body text overlap
- Commit SHA: `7d9681f`
- Push status: **NOT pushed** — authentication failed

### 2026-04-29 — Programming block mobile order (site-developer / MiniMax M2.5)
- Files touched: `components/ProgramsSection.tsx`
- What changed: Restructured ProgramRow to show description below title on mobile/tablet (flex-col with full width)
- Commit SHA: `699c125`
- Push status: **NOT pushed** — authentication failed

### 2026-04-29 — Programming block tablet view (site-developer / MiniMax M2.5)
- Files touched: `components/ProgramsSection.tsx`
- What changed: Ensured pricing is always visible on right side (added `lg:ml-auto`), kept within container
- Commit SHA: `699c125` (combined with mobile order fix)
- Push status: **NOT pushed** — authentication failed

---

## Completed fixes (2026-04-29)

All 5 layout fixes have been re-implemented against `racqueteer-fresh/` and are ready for push.

### Pending fixes

Re-implement the layout fixes against the **correct** repo (`racqueteer-fresh/` → `Slava12212/racqueteer.git`). They were applied earlier but ended up in `racqueteer-next/` (wrong remote = `Slava12212/Leha.git`) and never reached Alex's GitHub.

### Pending fixes
1. **Responsive min-h-screen** — Remove `.min-h-screen` (or `min-height: 100vh`) for screen widths **< 1024px**.
2. **Header navigation** — Fix the logo overlapping the menu on screens **< 1600px**. Logo and right-side menu must maintain proper clearance.
3. **Programming block (title)** — On screens **≤ 1280px**, the title overlaps the body text. Reduce title font-size or adjust layout.
4. **Programming block (mobile order)** — On screens **< 1024px**, move `.text-brand-gray` so it appears directly **below the heading**.
5. **Programming block (tablet view)** — Refactor for tablet: keep main block in container, place text below, ensure pricing is clearly visible on the right (currently missing/hidden).

---

## History

### 2026-04-29 — Project re-baselined (Michael Scott / Opus)
- Investigation: discovered the previous "min-h-screen mobile fix" commit (`2233887` on Apr 24) was made in `projects/racqueteer-next/` and pushed to `Slava12212/Leha.git`, NOT to Alex's `Slava12212/racqueteer` repo.
- Set up this CHANGELOG.md as the single source of truth for future changes.
- Spawned site-developer (MiniMax M2.5) to re-apply all 5 layout fixes against `racqueteer-fresh/` and push to `Slava12212/racqueteer.git`.

### 2026-04-29 — SSH deploy key set up + push completed (Michael Scott / Opus)
- Generated ed25519 deploy key on agent host: `~/.ssh/racqueteer_deploy` (private) + `.pub`. Public key shared with Alex.
- Alex added the key to `Slava12212/racqueteer` GitHub Deploy Keys with **write access**.
- Added SSH config alias `github-racqueteer` → `git@github.com` using that key (`~/.ssh/config`).
- Switched the `racqueteer-fresh/` remote from HTTPS to SSH: `git@github-racqueteer:Slava12212/racqueteer.git`.
- Verified auth: `ssh -T git@github-racqueteer` → "Hi Slava12212/racqueteer! You've successfully authenticated".
- **Pushed all 4 fix commits to `origin/main`. Remote HEAD now `699c125`.** ✅

### 2026-04-29 — Layout fixes applied (site-developer / MiniMax M2.5)

All commits now live on `Slava12212/racqueteer` (`origin/main`):

| # | Fix | Commit | Files |
|---|---|---|---|
| 1 | Drop `min-h-screen` below 1024px | `9f5ffba` | `app/globals.css` |
| 2 | Header logo / menu clearance below 1600px | `b3060fd` | `components/Navbar.tsx` |
| 3 | Programming-block title font-size at ≤1280px | `7d9681f` | `components/ProgramsSection.tsx` |
| 4 | Programming-block mobile order (description below title) | `699c125` | `components/ProgramsSection.tsx` |
| 5 | Programming-block tablet view (text below, pricing right) | `699c125` | `components/ProgramsSection.tsx` |

Note: fixes #4 and #5 share commit `699c125` — they're both reflows of the same `ProgramsSection.tsx` JSX/Tailwind classes, so they were committed together.

Build: `npx next build` ✅ passes.
Push status: ✅ pushed to `origin/main`.

### 2026-04-24 — min-h-screen mobile fix (committed to WRONG repo)
- Commit: `2233887` "fix(mobile): drop min-h-screen under 768px so sections size to content"
- Repo: `Slava12212/Leha.git` (incorrect — should have been `Slava12212/racqueteer.git`)
- File: `racqueteer-next/app/globals.css` (+7 lines)
- **Status: NOT in Alex's project repo. Needs to be redone in `racqueteer-fresh/` and pushed to `Slava12212/racqueteer.git`.**

### 2026-04-13 — ACF Pro prep refactor (`racqueteer-next/`)
- See `racqueteer-next/FILES-MODIFIED.md`.
- Same wrong-repo issue — those changes are also only in `Slava12212/Leha.git`. Whether to backport is TBD with Alex.

### 2026-04-08 — Initial Next.js refactor scaffold (`racqueteer-next/`)
- Migration from Vite+Express SPA to Next.js 14 + App Router.
- Pushed to `Slava12212/Leha.git`.

### 2026-04-23 — Fresh Next.js + WordPress headless setup (`racqueteer-fresh/`)
- Commit: `c273943` "Initial commit: Next.js + WordPress headless setup"
- Pushed to `Slava12212/racqueteer.git` ✅ (correct repo, this is the active one).
- Plus 4 follow-up commits adding ACF blocks, demo content importer, etc. (latest: `b867ab1` Apr 24).
