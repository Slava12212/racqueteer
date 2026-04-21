# Racqueteer — Developer Guide

> Pickleball & Padel club website built with Next.js 14 (App Router)

**Live preview:** http://165.245.138.156:3042  
**Repo:** https://github.com/Slava12212/Leha

---

## Quick Start

```bash
git clone git@github.com:Slava12212/Leha.git
cd Leha
pnpm install
pnpm dev
# → http://localhost:3042
```

**Requirements:** Node.js 18+, pnpm

---

## What Is This Project?

A marketing website for **Racqueteer**, a premium pickleball & padel club in Sydney, Australia. The site showcases club facilities, membership plans, programs/coaching, private events, careers, and locations.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · shadcn/ui · Mona Sans font

---

## Pages

| Route | File | What It Shows |
|-------|------|---------------|
| `/` | `app/page.tsx` | Homepage — hero video, about, locations, programs, memberships, testimonials, events |
| `/memberships` | `app/memberships/page.tsx` | Membership plans, pricing table, feature comparison |
| `/private-events` | `app/private-events/page.tsx` | Event hosting, gallery, corporate partners |
| `/about` | `app/about/page.tsx` | About us, mission, contact info |
| `/careers` | `app/careers/page.tsx` | Job listings with category filter, career contact |

---

## Project Structure

```
├── app/                    # Pages (Next.js App Router)
│   ├── page.tsx            # Homepage
│   ├── memberships/        # /memberships
│   ├── private-events/     # /private-events
│   ├── about/              # /about
│   ├── careers/            # /careers
│   ├── layout.tsx          # Root layout (metadata, fonts, global styles)
│   ├── globals.css         # Tailwind base + custom animations + font-face
│   ├── sitemap.ts          # Auto-generated sitemap
│   ├── robots.ts           # Robots.txt config
│   └── not-found.tsx       # 404 page
│
├── components/             # All React components
│   ├── Navbar.tsx          # Navigation (client component — mobile menu, active links)
│   ├── Footer.tsx          # Site footer
│   ├── HeroSection.tsx     # Homepage hero with video
│   ├── AboutSection.tsx    # "About Racqueteer" section
│   ├── LocationsSection.tsx
│   ├── ProgramsSection.tsx
│   ├── MembershipSection.tsx
│   ├── HomeSubscriptionsSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── EventsSection.tsx
│   ├── ScrollReveal.tsx    # Scroll-triggered animations (client component)
│   ├── AnimatedBlobs.tsx   # Decorative blob animations
│   ├── ButtonArrow.tsx     # Arrow icon for CTA buttons
│   ├── TestimonialCard.tsx
│   ├── about/              # About page-specific components
│   ├── careers/            # Careers page-specific components
│   ├── membership/         # Membership page-specific components
│   ├── amenities/          # Amenities section components + data
│   ├── private-events/     # Private events page-specific components
│   └── ui/                 # shadcn/ui primitives (button, card, dialog, etc.)
│
├── lib/
│   ├── api.ts              # ⭐ DATA LAYER — all content lives here
│   └── utils.ts            # Tailwind cn() helper
│
├── types/
│   └── index.ts            # TypeScript interfaces for all data structures
│
├── hooks/
│   ├── use-toast.ts        # Toast notifications
│   └── use-mobile.tsx      # Mobile detection hook
│
├── public/                 # Static assets
│   ├── fonts/              # Mona Sans variable font files
│   ├── *.mp4               # Hero/section background videos
│   ├── *.png               # Images, logos, backgrounds
│   └── robots.txt
│
└── docs/                   # Additional documentation
    ├── ACF-FIELD-MAP.md    # WordPress ACF field mapping (for WP integration)
    ├── COMPLETION-GUIDE.md # Component refactor guide
    └── ...
```

---

## The Data Layer — `lib/api.ts`

**This is the most important file for understanding the project.**

All page content and data is centralized in `lib/api.ts` as async functions that return typed data. Components receive data as props — they don't fetch anything themselves.

### How it works now (hardcoded):

```typescript
// lib/api.ts
export async function getJobs(): Promise<Job[]> {
  return [
    { id: 1, title: "Club Manager", description: "...", category: "Manager", date: "Apr 1, 2026" },
    // ...
  ];
}
```

### How pages consume it:

```typescript
// app/careers/page.tsx (Server Component)
import { getJobs, getCareersPageContent } from "@/lib/api";

export default async function CareersPage() {
  const jobs = await getJobs();
  const pageContent = await getCareersPageContent();
  return (
    <>
      <HeroCareers content={pageContent.hero} />
      <JobListingsSection jobs={jobs} />
    </>
  );
}
```

### Data functions available:

| Function | Returns | Used On |
|----------|---------|---------|
| `getHomepageContent()` | All homepage section text, CTAs, images | `/` |
| `getMembershipsPageContent()` | Membership page hero, headers | `/memberships` |
| `getPrivateEventsPageContent()` | Private events hero, gallery, logos | `/private-events` |
| `getAboutPageContent()` | About hero, mission, contact | `/about` |
| `getCareersPageContent()` | Careers hero, job listings header, contact | `/careers` |
| `getNavbarContent()` | Logo, menu links, CTA button | All pages |
| `getFooterContent()` | Footer logo, links, locations, legal | All pages |
| `getJobs()` | Job listings array | `/careers` |
| `getJobCategories()` | Category filter options | `/careers` |
| `getMembershipPlans()` | Membership plan cards | `/`, `/memberships` |
| `getMembershipFeatures()` | Feature list for plans | `/memberships` |
| `getPriceCompareData()` | Comparison table data | `/memberships` |
| `getAmenities()` | Amenity sections with images | `/` |
| `getTestimonials()` | Testimonial cards | `/` |
| `getLocations()` | Club locations | `/` |
| `getPrograms()` | Programs/clinics | `/` |
| `getProgramTabs()` | Program category tabs | `/` |

### To connect to a CMS later:

Replace the hardcoded returns with `fetch()` calls. Each function has a `// TODO` comment showing the target WP REST API endpoint. The component layer doesn't change at all.

---

## Server vs Client Components

**Server Components** (default — no directive needed):
- All page files (`app/*/page.tsx`)
- Most section components
- Data fetching happens here

**Client Components** (marked with `"use client"` at top):
- `Navbar.tsx` — useState for mobile menu, usePathname for active link
- `ScrollReveal.tsx` — IntersectionObserver for scroll animations
- `AnimatedBlobs.tsx` — useEffect for animations
- `components/careers/JobListingsSection.tsx` — useState for category filter
- All `components/ui/*.tsx` — shadcn/ui primitives
- Any component with onClick, useState, useEffect, or browser APIs

---

## Styling

### Tailwind CSS
Standard Tailwind with custom config in `tailwind.config.ts`. Extended colors, fonts, and animations.

### Custom CSS (`app/globals.css`)
- **CTA button styles:** `.btn-cta`, `.btn-cta-red`, `.btn-cta-blue`, `.btn-cta-white`, `.btn-cta-lightblue`
- **Animations:** `ani-animateMesh` (gradient), `marquee` (logo scroll), `blob-move-*` (decorative)
- **Utilities:** `.scrollbar-hide` (hides scrollbars on carousels)

### Font
**Mona Sans** — variable font (weight 100-900, stretch 75%-125%). Files in `public/fonts/`, loaded via `@font-face` in globals.css.

---

## WordPress Integration (Future)

The project is designed to be connected to a headless WordPress + ACF Pro setup:

1. **`docs/ACF-FIELD-MAP.md`** — Complete field-by-field mapping of every ACF field group, field name, field type, and which component prop it maps to
2. **`docs/COMPLETION-GUIDE.md`** — Step-by-step guide for wiring remaining components to accept content props
3. **Custom Post Types needed:** Jobs, Membership Plans, Testimonials, Locations, Programs
4. **ACF Field Groups needed:** Homepage Content, Memberships Page, Private Events Page, About Page, Careers Page, Site Settings (global nav/footer)

All you'd change is `lib/api.ts` — swap hardcoded returns for `fetch()` calls to WP REST API endpoints.

---

## Build & Deploy

```bash
# Development (hot reload)
pnpm dev          # → http://localhost:3042

# Production build
pnpm build
pnpm start        # → http://localhost:3042

# Lint
pnpm lint
```

### Notes
- Port is set to **3042** in `package.json` scripts
- Videos in `public/` are large (~200MB total) — they're served as static assets
- `public/originals/` contains unoptimized source videos (can be excluded from deploys)

---

## Key Files to Know

| File | Why It Matters |
|------|---------------|
| `lib/api.ts` | All content/data — start here to understand what content exists |
| `types/index.ts` | TypeScript interfaces for every data structure |
| `app/globals.css` | Custom animations, button styles, font loading |
| `tailwind.config.ts` | Extended theme (colors, fonts, breakpoints) |
| `components/Navbar.tsx` | Main nav — client component with mobile menu |
| `docs/ACF-FIELD-MAP.md` | Full WordPress/ACF integration reference |

---

## Questions?

Ping in #alex-personal-project-web-dev on Slack.
