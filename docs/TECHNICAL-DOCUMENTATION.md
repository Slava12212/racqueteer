# Racqueteer — Technical Documentation

> **Who this document is for:** Developers working on the Racqueteer Next.js frontend, the WordPress theme, or the GraphQL integration.

---

## 1. Project Overview

Racqueteer is a **headless WordPress + Next.js** website. Content is managed entirely in WordPress (using Advanced Custom Fields PRO blocks and Custom Post Types) and delivered to the React frontend via WPGraphQL. The frontend is deployed on Vercel with Incremental Static Regeneration (ISR).

### Key Principles

- **WordPress is the CMS only** — it serves no HTML to visitors. Its only output is JSON via GraphQL.
- **Next.js renders everything** — static pages pre-rendered at build time and refreshed via ISR.
- **Fallback safety** — every data function falls back to hardcoded data if WordPress is unreachable. The site never breaks due to CMS downtime.
- **Zero-downtime content updates** — WordPress sends a webhook on save → Next.js invalidates only the affected page cache (~1 second).

---

## 2. Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend framework | Next.js (App Router) | 14.2.x |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4 |
| UI components | Radix UI + shadcn/ui | — |
| CMS | WordPress | Latest |
| ACF fields & blocks | Advanced Custom Fields PRO | Latest |
| GraphQL API | WPGraphQL + WPGraphQL for ACF | Latest |
| Block integration | WPGraphQL Content Blocks | Latest |
| Hosting (frontend) | Vercel | — |
| Hosting (WordPress) | racqueteer.websplash.pro | — |

---

## 3. Services & URLs

| Service | URL |
|---------|-----|
| Live site (Vercel) | https://racqueteer.vercel.app |
| GitHub repository | https://github.com/Slava12212/racqueteer |
| WordPress frontend | https://racqueteer.websplash.pro |
| WordPress Admin | https://racqueteer.websplash.pro/wp-admin/ |
| WPGraphQL endpoint | https://racqueteer.websplash.pro/graphql |
| WP REST API | https://racqueteer.websplash.pro/wp-json |
| WP Settings page | https://racqueteer.websplash.pro/wp-admin/options-general.php?page=racqueteer-settings |

---

## 4. Repository Structure

```
theme/racqueteer/           ← Git root (Next.js project)
│
├── app/                    ← Next.js App Router pages
│   ├── layout.tsx          ← Root layout: Navbar + Footer from WP Options
│   ├── page.tsx            ← Home page (/)
│   ├── about/page.tsx      ← /about
│   ├── careers/page.tsx    ← /careers
│   ├── memberships/page.tsx← /memberships
│   ├── private-events/page.tsx
│   ├── [slug]/page.tsx     ← Dynamic route: any WP page by slug
│   ├── not-found.tsx
│   ├── robots.ts / sitemap.ts
│   └── api/
│       ├── revalidate/route.ts   ← ISR webhook endpoint
│       └── debug-jobs/route.ts   ← Debug endpoint for jobs data
│
├── components/
│   ├── blocks/             ← ONE FILE PER BLOCK (20 total)
│   │   ├── BlockRenderer.tsx     ← Routes __typename → component
│   │   ├── HeroBlock.tsx
│   │   ├── AboutBlock.tsx
│   │   └── ... (18 more)
│   ├── Navbar.tsx          ← Header component
│   ├── Footer.tsx          ← Footer component
│   ├── HeroSection.tsx     ← Actual section implementations
│   ├── AboutSection.tsx
│   ├── ...
│   ├── about/              ← About page section components
│   ├── careers/            ← Careers page section components
│   ├── membership/         ← Memberships page section components
│   ├── private-events/     ← Private Events page section components
│   ├── amenities/          ← Amenities sub-components
│   └── ui/                 ← shadcn/ui primitives
│
├── lib/
│   ├── wp-api.ts           ← PRIMARY: WPGraphQL client + all data functions
│   ├── api.ts              ← FALLBACK: hardcoded data (do not modify)
│   ├── navbar-cta.ts       ← React Context for CTA button state
│   ├── utils.ts            ← Tailwind class merge utility
│   └── graphql/
│       ├── queries.ts      ← All GraphQL query strings
│       └── fragments.ts    ← Reusable GraphQL fragments
│
├── types/
│   ├── index.ts            ← All TypeScript interfaces for content + WP options
│   └── wp-blocks.ts        ← TypeScript interfaces for block attributes
│
├── public/                 ← Static assets (videos, images)
│   ├── hero-video-opt.mp4
│   ├── logo2.svg
│   └── ...
│
├── docs/                   ← Project documentation
│
├── wp/                     ← WordPress theme (upload to wp-content/themes/racqueteer/)
│   ├── functions.php       ← Theme bootstrap (requires all inc/ files)
│   ├── style.css           ← Theme header (name, version)
│   ├── index.php           ← Redirects visitors to Next.js frontend
│   └── inc/
│       ├── acf-blocks.php          ← Registers 20 ACF blocks + CPT field groups + Options fields
│       ├── cpt-registration.php    ← Registers 6 Custom Post Types
│       ├── theme-setup.php         ← Theme support, block category, ACF Options Pages
│       ├── graphql-extensions.php  ← v19: Block interface injection + flat field resolvers
│       ├── revalidate-webhook.php  ← ISR webhook + WP Admin settings page
│
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 5. Environment Variables

### Local (`.env.local` — not in git)

```env
NEXT_PUBLIC_WP_GRAPHQL_URL=https://racqueteer.websplash.pro/graphql
NEXT_PUBLIC_WP_REST_URL=https://racqueteer.websplash.pro/wp-json
REVALIDATE_SECRET=Racqueteer_ISR_2026_ChangeMe!
```

### Vercel (Settings → Environment Variables)

Same three variables must be added in the Vercel project dashboard.

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_WP_GRAPHQL_URL` | WPGraphQL endpoint URL |
| `NEXT_PUBLIC_WP_REST_URL` | WordPress REST API base URL |
| `REVALIDATE_SECRET` | Shared secret for ISR webhook authentication |

> `NEXT_PUBLIC_` prefix makes the variable available in browser-side code. Only `NEXT_PUBLIC_WP_GRAPHQL_URL` and `NEXT_PUBLIC_WP_REST_URL` are actually used client-side (for the GraphQL fetch). `REVALIDATE_SECRET` is server-only but is prefixed for historic reasons — it's only read in the API route.

---

## 6. Data Flow Architecture

```
WordPress Admin
    │
    │  Editor saves page / CPT / Options
    ▼
WordPress (PHP)
    │  parse_blocks() reads Gutenberg block content
    │  get_field() reads ACF field values
    │  graphql-extensions.php resolves attachment IDs → URLs
    ▼
WPGraphQL endpoint (/graphql)
    │  Serves GraphQL schema
    │  Page.blocks → [AcfRacqueteer*Block, ...]
    │  Each block has flat field object (e.g. racqueteerHero { title ... })
    ▼
Next.js (lib/wp-api.ts)
    │  wpGraphQL<T>(query) → fetch with ISR cache tags
    │  getPageBlocks(slug) → WPBlock[]
    │  getSiteOptions() → { navbar, footer }
    │  getJobs() / getLocations() / etc.
    ▼
Next.js Page (app/*/page.tsx)
    │  if blocks.length > 0 → <BlockRenderer blocks={blocks} />
    │  else → fallback hardcoded components
    ▼
BlockRenderer (components/blocks/BlockRenderer.tsx)
    │  BLOCK_MAP[block.__typename] → Component
    │  <HeroBlock title="..." videoUrl="..." />
    ▼
Section Component (components/HeroSection.tsx)
    │  Renders HTML + Tailwind CSS
    ▼
Visitor Browser
```

### ISR Cache Invalidation Flow

```
WordPress save_post / acf/save_post hook
    │
    ▼
wp/inc/revalidate-webhook.php
    │  racqueteer_send_revalidate(slug)
    │  POST /api/revalidate?secret=TOKEN  { slug: "/" }
    ▼
app/api/revalidate/route.ts
    │  revalidateTag('wp-content')   ← purges fetch cache
    │  revalidatePath(slug)          ← purges Full Route Cache
    ▼
Next.js re-renders the affected page on next request (~1 second)
```

---

## 7. Block System

### Concept

Each section of each page is a **Gutenberg block** in WordPress. When a page is requested, the GraphQL query returns an array of blocks. Each block has a `__typename` (e.g. `AcfRacqueteerHeroBlock`) and a field object with the ACF data (e.g. `racqueteerHero { title, videoUrl, ... }`).

### Block Name Convention

| WordPress block name | WPGraphQL `__typename` | Next.js block component |
|---------------------|----------------------|------------------------|
| `acf/racqueteer-hero` | `AcfRacqueteerHeroBlock` | `components/blocks/HeroBlock.tsx` |
| `acf/racqueteer-about` | `AcfRacqueteerAboutBlock` | `components/blocks/AboutBlock.tsx` |
| `acf/racqueteer-locations` | `AcfRacqueteerLocationsBlock` | `components/blocks/LocationsBlock.tsx` |
| `acf/racqueteer-programs` | `AcfRacqueteerProgramsBlock` | `components/blocks/ProgramsBlock.tsx` |
| `acf/racqueteer-membership-cta` | `AcfRacqueteerMembershipCtaBlock` | `components/blocks/MembershipCtaBlock.tsx` |
| `acf/racqueteer-subscriptions` | `AcfRacqueteerSubscriptionsBlock` | `components/blocks/SubscriptionsBlock.tsx` |
| `acf/racqueteer-testimonials` | `AcfRacqueteerTestimonialsBlock` | `components/blocks/TestimonialsBlock.tsx` |
| `acf/racqueteer-events` | `AcfRacqueteerEventsBlock` | `components/blocks/EventsBlock.tsx` |
| `acf/racqueteer-membership-hero` | `AcfRacqueteerMembershipHeroBlock` | `components/blocks/MembershipHeroBlock.tsx` |
| `acf/racqueteer-subscriptions-detail` | `AcfRacqueteerSubscriptionsDetailBlock` | `components/blocks/SubscriptionsDetailBlock.tsx` |
| `acf/racqueteer-price-compare` | `AcfRacqueteerPriceCompareBlock` | `components/blocks/PriceCompareBlock.tsx` |
| `acf/racqueteer-private-events-hero` | `AcfRacqueteerPrivateEventsHeroBlock` | `components/blocks/PrivateEventsHeroBlock.tsx` |
| `acf/racqueteer-gallery` | `AcfRacqueteerGalleryBlock` | `components/blocks/GalleryBlock.tsx` |
| `acf/racqueteer-logo-marquee` | `AcfRacqueteerLogoMarqueeBlock` | `components/blocks/LogoMarqueeBlock.tsx` |
| `acf/racqueteer-about-hero` | `AcfRacqueteerAboutHeroBlock` | `components/blocks/AboutHeroBlock.tsx` |
| `acf/racqueteer-mission` | `AcfRacqueteerMissionBlock` | `components/blocks/MissionBlock.tsx` |
| `acf/racqueteer-contact` | `AcfRacqueteerContactBlock` | `components/blocks/ContactBlock.tsx` |
| `acf/racqueteer-careers-hero` | `AcfRacqueteerCareersHeroBlock` | `components/blocks/CareersHeroBlock.tsx` |
| `acf/racqueteer-job-listings` | `AcfRacqueteerJobListingsBlock` | `components/blocks/JobListingsBlock.tsx` |
| `acf/racqueteer-career-contact` | `AcfRacqueteerCareerContactBlock` | `components/blocks/CareerContactBlock.tsx` |

### How BlockRenderer Works

`components/blocks/BlockRenderer.tsx` contains a static map (`BLOCK_MAP`) of `__typename` strings to dynamically imported React components. It also keeps legacy `acf/` style keys for backwards compatibility.

```tsx
// Simplified example
const BLOCK_MAP = {
  'AcfRacqueteerHeroBlock': dynamic(() => import('./HeroBlock')),
  'AcfRacqueteerAboutBlock': dynamic(() => import('./AboutBlock')),
  // ... 18 more
  // Legacy keys (fallback)
  'acf/racqueteer-hero': dynamic(() => import('./HeroBlock')),
};

export default function BlockRenderer({ blocks }) {
  return blocks.map((block, i) => {
    const Component = BLOCK_MAP[block.name]; // block.name = __typename
    if (!Component) return null;
    return <Component key={i} {...block.attributes} />;
  });
}
```

Each `*Block.tsx` is a thin wrapper that maps flat block attributes to the underlying section component's `content` prop:

```tsx
// components/blocks/HeroBlock.tsx
export default function HeroBlock(attrs: WPHeroAttributes) {
  return <HeroSection content={{
    title: attrs.title,
    videoUrl: attrs.videoUrl,
    // ...
  }} />;
}
```

### How Block Data is Resolved in WordPress (flattenBlockAttributes)

`lib/wp-api.ts` contains `flattenBlockAttributes(raw)` which handles both ACF schema formats:

- **New flat schema** (current): ACF data is at the top level of the block object as a named field group, e.g. `block.racqueteerHero.title`
- **Legacy nested schema**: Data under `block.attributes.racqueteerHero.title`

The function finds the first non-standard key on the raw block and returns its value as the attributes object. The GraphQL queries use the flat schema (inline fragments with named field groups).

---

## 8. GraphQL Schema

### Querying Page Blocks

The main query is `GET_PAGE_BY_SLUG` in `lib/graphql/queries.ts`:

```graphql
query GetPage($slug: String!) {
  pageBy(uri: $slug) {
    title
    status
    blocks {
      __typename
      ... on AcfRacqueteerHeroBlock {
        racqueteerHero {
          title
          description
          ctaPrimaryText
          ctaPrimaryUrl
          videoUrl
        }
      }
      ... on AcfRacqueteerLocationsBlock {
        racqueteerLocations { label title description }
      }
      # ... 18 more inline fragments
    }
  }
}
```

### Custom Post Type Queries

Each CPT has its own query using ACF field group names:

```graphql
# Jobs
query GetJobs {
  jobs(first: 100, where: { orderby: { field: MENU_ORDER, order: ASC } }) {
    nodes { databaseId title jobFields { description category } date }
  }
}

# Locations
query GetLocations {
  locations(first: 100) {
    nodes { databaseId locationFields { locationId name status address description image { node { sourceUrl } } } }
  }
}

# Programs — NOTE: `color` is queried at the Program node level, NOT inside programFields.
# See graphql-extensions.php note on ACF select field resolvers for the reason.
query GetPrograms {
  programs(first: 100) {
    nodes {
      color
      programFields { title price unit description }
    }
  }
}
```

### Site Options (Navbar + Footer)

```graphql
query GetSiteOptions {
  acfOptionsNavbar {
    navbar { navLogo { sourceUrl altText } navLinks { label url } navCtaText navCtaUrl }
  }
  acfOptionsFooter {
    footer { footerLogo { sourceUrl altText } footerEmail footerPhone footerMenuLinks { label url } ... }
  }
}
```

---

## 9. WordPress PHP Theme

### File Responsibilities

| File | Responsibility |
|------|----------------|
| `functions.php` | Bootstraps theme: requires all `inc/` files |
| `style.css` | Theme header metadata only |
| `index.php` | Redirects all PHP page requests to the Next.js URL |
| `inc/cpt-registration.php` | Registers 6 CPTs with `show_in_graphql: true` |
| `inc/theme-setup.php` | Theme supports, block category, ACF Options sub-pages (Navbar, Footer) |
| `inc/acf-blocks.php` | Registers all 20 ACF blocks + their field groups + CPT field groups + Options field groups |
| `inc/graphql-extensions.php` | v25: Block interface injection, flat `Rq*Fields` types, image ID→URL resolver, Strategy H runtime resolver, manual resolvers for ACF select fields (locationStatus, Program.color, Amenity.imageLayout) |
| `inc/revalidate-webhook.php` | Sends ISR webhook on `save_post` for all CPTs; `acf/save_post` for Options; `transition_post_status` for Draft/Publish changes |

### CPT Registration

6 Custom Post Types are registered in `cpt-registration.php`:

| CPT slug | GraphQL plural | Used on |
|----------|---------------|---------|
| `job` | `jobs` | Careers page |
| `testimonial` | `testimonials` | Home page |
| `membership` | `memberships` | Memberships + Home page |
| `amenity` | `amenities` | Reserved (not used in frontend yet) |
| `location` | `locations` | Home + About pages |
| `program` | `programs` | Home page |

All CPTs are registered with `show_in_graphql: true` and appropriate `menu_supports` including `page-attributes` for ordering where needed.

### ACF Block Registration

`acf-blocks.php` uses a single loop over a `$blocks` array definition to register each block via `acf_register_block_type()` and attach an `acf_add_local_field_group()`. The naming convention:

```
Block name:              racqueteer-hero
graphql_field_name:      racqueteerHero       (camelCase, computed by PHP)
WP block type:           acf/racqueteer-hero
WPGraphQL type:          AcfRacqueteerHeroBlock
GraphQL field on block:  racqueteerHero { title ... }
```

### GraphQL Extensions (v25)

`graphql-extensions.php` solves the core integration problem: making `AcfRacqueteer*Block` types implement the `Block` interface from WPGraphQL Content Blocks, so that `Page.blocks` returns ACF blocks.

**Strategies (all active, ordered by reliability):**

| Strategy | When it fires | What it does |
|----------|--------------|--------------|
| **A** | `wpgraphql_acf_block_type_config` priority 5 | Adds `Block` to `interfaces` in ACF block type config |
| **B** | `graphql_wp_object_type_config` priority 999 | Injects real `Block` interface object at schema build time |
| **C** | `graphql_register_types` priority 100 | Fallback: registers any `AcfRacqueteer*Block` type that ACF missed |
| **E** | `graphql_register_types` priority 1 | `register_graphql_interfaces_to_types(['Block'], $allBlocks)` |
| **G** | `graphql_register_types` priority 1 | Pre-registers `Block` and `EditorBlock` interfaces before ACF builds block types at priority 10 |
| **H** | `graphql_resolve_field` (runtime filter) | If `Page.blocks` resolver returns 0 results, parses `post_content` directly via `parse_blocks()` and maps ACF block names to their `__typename` |

**Strategy H is the key runtime fix.** It fires after WPGraphQL's own resolver and replaces an empty result set with blocks parsed from `post_content`. The existing `Rq*Fields` resolvers in the same file then read ACF data from `$source['attrs']['data']` (where ACF stores field values in the Gutenberg block comment).

**Flat field types** (`Rq*Fields` section): Each block type has a corresponding `RqRacqueteer*Fields` GraphQL object type registered with all its string fields. A `graphql_resolve_field` closure maps snake_case ACF data keys to camelCase GraphQL field names, and resolves image attachment IDs to full URLs via `wp_get_attachment_url()`.

**Manual ACF select field resolvers:** WPGraphQL for ACF v2.6.x serializes select fields as PHP arrays (e.g. `['red']`) and casting them to `(string)` throws a `TypeError` in PHP 8.x. Three fields are registered manually with `show_in_graphql=false` in `acf-blocks.php` and exposed via custom resolvers in `graphql-extensions.php`:

| Field | GraphQL type | Resolver registered on | Notes |
|-------|-------------|----------------------|-------|
| `field_loc_status` | `Location.locationStatus` | `Location` | Returns `'available'` or `'coming_soon'` |
| `field_amenity_image_layout` | `Amenity.imageLayout` / `AmenityFields.imageLayout` | `Amenity`, `AmenityFields` | Returns `'single'` or `'split'` |
| `field_prog_color` | `Program.color` / `ProgramFields.color` | `Program`, `ProgramFields` | Returns `'red'` or `'blue'` — **always query at `Program` node level** (see below) |

> ⚠️ **Program.color — important query pattern:** The `color` field **must be queried at the `Program` node level**, not inside `programFields { color }`. When called via `programFields { color }`, the `$source` passed to the resolver is the ACF field group wrapper object which lacks `databaseId`/`ID` → `get_field()` cannot find the post → always falls back to `'blue'`. The `Program`-level resolver correctly receives the post model object.
>
> **Correct query:**
> ```graphql
> programs { nodes { color programFields { title price unit description } } }
> ```
> **Wrong query (always returns blue):**
> ```graphql
> programs { nodes { programFields { color title price unit description } } }
> ```
> Fixed in commit `bccb7e3` (May 2026).

---

## 10. ISR Caching Strategy

### Cache Layers

| Layer | Mechanism | TTL |
|-------|-----------|-----|
| **Fetch cache** (Data Cache) | `next: { revalidate: 60, tags: ['wp-content'] }` | 60 seconds |
| **Full Route Cache** (Page cache) | `export const revalidate = 3600` | 3600 seconds |
| **Site Options** | `unstable_cache` | 3600 seconds, tag `wp-content` |
| **On-demand invalidation** | `POST /api/revalidate` | Immediate |

### On-demand Invalidation

`app/api/revalidate/route.ts` accepts a `POST` request with:
- Query: `?secret=REVALIDATE_SECRET`
- Body: `{ "slug": "/about" }`

It calls:
```ts
revalidateTag('wp-content'); // invalidates all fetch-cached WP data
revalidatePath(slug);        // invalidates the specific page Full Route Cache
```

WordPress sends this request automatically via `wp-remote_post` in `revalidate-webhook.php` whenever:
- A page is saved (`save_post_page`)
- A CPT record is saved/status-changed
- ACF Options are updated (`acf/save_post`)
- A page transitions between Draft and Published (`transition_post_status`)

### CPT → Page Mapping (Webhook)

| WordPress CPT save | Pages invalidated |
|-------------------|------------------|
| `page` | the page's own slug |
| `job` | `/careers` |
| `location` | `/` |
| `testimonial` | `/` |
| `membership` | `/`, `/memberships` |
| `program` | `/` |
| ACF Options | `/`, `/memberships`, `/private-events`, `/about`, `/careers` |

---

## 11. Dynamic Pages — Draft/Publish System

`app/[slug]/page.tsx` handles any WordPress page that isn't covered by a static Next.js route.

- `dynamicParams = true` — new pages are generated on first request (ISR)
- `generateStaticParams()` — pre-renders existing published pages at build time (via `getAllPageSlugs()` using WP REST API)
- `getPageBySlug(slug)` — fetches page status and blocks from WPGraphQL
- If `page.status !== 'publish'` → `notFound()` → 404

Static routes (`/memberships`, `/about`, `/careers`, `/private-events`) take priority over `[slug]` in the Next.js router.

---

## 12. Fallback System

Every data function in `lib/wp-api.ts` wraps its GraphQL call in a `try/catch`. On failure, it falls back to the equivalent function in `lib/api.ts` (hardcoded data).

Every page in `app/*/page.tsx` checks `if (blocks.length > 0)` before using BlockRenderer. If WordPress returns no blocks (e.g. not yet configured), the page falls back to rendering hardcoded components.

**The site is always functional**, even if WordPress is completely unreachable.

```
lib/wp-api.ts   →  getJobs()          → catch → lib/api.ts getJobs()
app/page.tsx    →  blocks.length > 0  → else  → hardcoded HeroSection etc.
```

---

## 13. Navbar CTA Context

The CTA button text and URL from WP Options is passed down through a React Context (`lib/navbar-cta.ts`) so that both the Navbar component and any deep block component can access the current CTA values without prop drilling.

`app/layout.tsx` wraps the app in `<CtaProvider ctaText={...} ctaUrl={...}>`. Components read via `useCta()` hook.

---

## 14. Key File Reference

| File | Role | When to edit |
|------|------|-------------|
| `lib/wp-api.ts` | Primary WP data client | Adding new data functions, changing GraphQL response mapping |
| `lib/api.ts` | Hardcoded fallback data | Updating fallback text/data (rarely needed) |
| `lib/graphql/queries.ts` | All GraphQL queries | Adding new fields to existing blocks, adding new queries |
| `components/blocks/BlockRenderer.tsx` | Block routing map | Adding a new block type |
| `components/blocks/*.tsx` | Block wrapper components | Adding a new block type |
| `types/index.ts` | Content TypeScript interfaces | Adding new fields/sections |
| `types/wp-blocks.ts` | Block attribute interfaces | Adding new block attributes |
| `app/layout.tsx` | Root layout (Navbar, Footer) | Changing global layout, WP Options integration |
| `wp/inc/acf-blocks.php` | Block & field registration | Adding new blocks, changing field structure |
| `wp/inc/graphql-extensions.php` | GraphQL schema extensions | Fixing GraphQL schema issues, adding new field resolvers |
| `wp/inc/cpt-registration.php` | Custom Post Types | Adding new CPTs |
| `wp/inc/revalidate-webhook.php` | ISR webhook logic | Adding new CPT → page mappings |
| `next.config.mjs` | Next.js config | Adding new external image domains |

---

## 15. Adding a New Block (Development Checklist)

To add a completely new ACF block to the system:

### 1. WordPress PHP side

In `wp/inc/acf-blocks.php`, add to the `$blocks` array:
```php
['name'=>'racqueteer-new-section','title'=>'New Section','icon'=>'admin-page','keywords'=>['new'],'fields'=>[
    ['key'=>'field_ns_label','label'=>'Label','name'=>'label','type'=>'text'],
    ['key'=>'field_ns_title','label'=>'Title','name'=>'title','type'=>'text'],
    // ... other fields
]],
```

In `wp/inc/graphql-extensions.php`, add to `$rq_acf_block_names`, `$all_fields`, and `$block_field_map`:
```php
'AcfRacqueteerNewSectionBlock',            // $rq_acf_block_names
'RqRacqueteerNewSectionFields' => ['label', 'title', ...],  // $all_fields
'AcfRacqueteerNewSectionBlock' => ['field' => 'racqueteerNewSection', 'type' => 'RqRacqueteerNewSectionFields'],  // $block_field_map
```

### 2. GraphQL Query

In `lib/graphql/queries.ts`, add an inline fragment to `GET_PAGE_BY_SLUG`:
```graphql
... on AcfRacqueteerNewSectionBlock {
  racqueteerNewSection { label title }
}
```

### 3. TypeScript Types

In `types/wp-blocks.ts`:
```ts
export interface WPNewSectionAttributes {
  label: string;
  title: string;
}
```

### 4. Block Component

Create `components/blocks/NewSectionBlock.tsx`:
```tsx
import NewSection from '@/components/NewSection';
export default function NewSectionBlock(attrs: WPNewSectionAttributes) {
  return <NewSection content={{ label: attrs.label, title: attrs.title }} />;
}
```

### 5. BlockRenderer

In `components/blocks/BlockRenderer.tsx`, add to `BLOCK_MAP`:
```ts
'AcfRacqueteerNewSectionBlock': dynamic(() => import('./NewSectionBlock')),
'acf/racqueteer-new-section':   dynamic(() => import('./NewSectionBlock')),
```

### 6. Upload & Test

- Upload updated `acf-blocks.php` and `graphql-extensions.php` to the WP server
- Add the block to a WP page in Gutenberg
- Verify with: `{ pageBy(uri: "/") { blocks { __typename } } }`

---

## 16. Deployment

### Next.js (Vercel)

All commits pushed to the `main` branch on GitHub are automatically deployed by Vercel. No manual action is needed.

```bash
git add .
git commit -m "describe changes"
git push
# Vercel builds and deploys in ~2–3 minutes
```

Build check locally before pushing:
```bash
cd E:\Projects\Leha-main\theme\racqueteer
pnpm build
```

### WordPress PHP Theme

PHP files (`wp/inc/*.php`) are **not deployed via Vercel**. They must be uploaded separately to the WordPress hosting server.

**Upload path on server:** `/public_html/wp-content/themes/racqueteer/`

**Methods:**
1. **FTP/SFTP** — connect to `racqueteer.websplash.pro` and upload `wp/` folder contents
2. **WP Admin** → Appearance → Theme File Editor (not recommended for large files)
3. **WP-CLI via SSH**: `scp wp/inc/graphql-extensions.php user@host:/path/to/themes/racqueteer/inc/`

**Verify deployment version:**
```graphql
{ __type(name: "RqDeployVersion") { enumValues { name } } }
```
Should return `v25` (or current version).

---

## 17. Development Workflow

```bash
# Start local dev server
cd E:\Projects\Leha-main\theme\racqueteer
pnpm dev      # → http://localhost:3042

# Type checking
pnpm tsc --noEmit

# Build check
pnpm build

# Deploy to Vercel
git add .
git commit -m "feat/fix: description"
git push
```

Local development uses WordPress at `racqueteer.websplash.pro` via GraphQL (`.env.local` must be present). If WP is unreachable, the site automatically falls back to hardcoded data in `lib/api.ts`.

---

## 18. Troubleshooting

### `Page.blocks` returns empty array in GraphQL

Possible causes and fixes:

1. **WPGraphQL Content Blocks plugin not installed** — install it in WP Admin → Plugins
2. **`AcfRacqueteer*Block` types not implementing `Block` interface** — Strategy H in `graphql-extensions.php` handles this as a runtime override. Check `wp_options.rq_diag_blocks_resolver` in the WP database for diagnostic info.
3. **Block data not in Gutenberg post_content** — check if the page was saved correctly in the Gutenberg editor.
4. **Old version of `graphql-extensions.php` on server** — upload the v25 file.

**Diagnostic query:**
```graphql
{
  __type(name: "AcfRacqueteerHeroBlock") {
    name
    interfaces { name }
  }
}
```
Should show `Block` in interfaces. If empty, the interface injection hasn't worked.

### Program cards always show blue color (Color field ignored)

**Root cause:** The `color` ACF select field has `show_in_graphql=false` and is exposed via a manual resolver in `graphql-extensions.php`. When queried as `programFields { color }`, the resolver receives the ACF field group wrapper as `$source` — this object has no `databaseId`/`ID`, so `get_field()` cannot retrieve the post meta → always returns the fallback value `'blue'`.

**Fix (applied in commit `bccb7e3`):**
- `GET_PROGRAMS` query moved `color` from inside `programFields{}` to the `Program` node level
- `wp-api.ts` reads `node.color` instead of `node.programFields.color`
- The `Program`-level resolver receives the actual post object with `databaseId` → works correctly

**If it persists:** Confirm the updated `graphql-extensions.php` (v25) is on the WP server. Test with:
```graphql
{
  programs(first: 3) {
    nodes { color programFields { title } }
  }
}
```
If `color` returns `null` or always `"blue"` → v25 resolver is not deployed on the server.

### Images showing as numbers (`src="54"`)

The image attachment ID is being passed as-is instead of being resolved to a URL. This means `graphql-extensions.php` is either missing or outdated (pre-v18 which added image resolution in the flat field resolver).

Upload latest `wp/inc/graphql-extensions.php` to the hosting server.

### "Please enter a valid URL" in ACF fields

URL-type ACF fields reject relative paths like `/memberships`. The current version of `acf-blocks.php` uses `'type' => 'text'` for these fields to accept any value. Upload latest `acf-blocks.php`.

### Vercel build fails after git push

1. Check Vercel Dashboard → Deployments → build log
2. Run `pnpm build` locally — fix any TypeScript errors
3. Common issue: new block attributes not typed in `types/wp-blocks.ts`

### Jobs not loading on Careers page

The Careers page uses `getJobs()` which fetches from WP CPT. If WP returns an error:
- Fallback to hardcoded data is automatic
- Check WP: `WPAdmin → Jobs` — are any jobs published?
- Debug endpoint available: `GET /api/debug-jobs` (returns raw API response)

### Navbar logo shows wrong image

`app/layout.tsx` prefers `navbar.navLogo.sourceUrl` from WP, falling back to hardcoded logo if `navbar` is null or `navbar.navLinks` is empty. If you see an incorrect logo:
- Check `WP Admin → Site Settings → Navbar` — is the Logo field set?
- Check that WPGraphQL for ACF is returning the `acfOptionsNavbar` field

---

## 19. GraphQL Diagnostic Queries

Useful queries for debugging at `https://racqueteer.websplash.pro/graphql`:

```graphql
# Check if Block interface is registered and implemented
{
  __type(name: "AcfRacqueteerHeroBlock") {
    name
    interfaces { name }
    fields { name }
  }
}

# Test page blocks
{
  pageBy(uri: "/") {
    title
    status
    blocks {
      __typename
      ... on AcfRacqueteerHeroBlock {
        racqueteerHero { title description ctaPrimaryText videoUrl }
      }
    }
  }
}

# Test Navbar options
{
  acfOptionsNavbar {
    navbar { navCtaText navCtaUrl navLinks { label url } }
  }
}

# Test CPT data
{
  jobs(first: 5) {
    nodes { title jobFields { category description } }
  }
}

# Test Programs — color must be at node level, NOT inside programFields
{
  programs(first: 5) {
    nodes {
      color
      programFields { title price unit description }
    }
  }
}

# Check deploy version sentinel
{
  __type(name: "RqDeployVersion") {
    enumValues { name }
  }
}
```

