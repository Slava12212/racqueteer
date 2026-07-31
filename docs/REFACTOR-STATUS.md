# ACF Pro Prep Refactor + WordPress Integration — Status Report

> **Актуалізовано: 05.05.2026**
> Попередній звіт (13.04.2026) суттєво застарів — нижче фактичний стан проекту.

---

## ✅ ПОВНІСТЮ ГОТОВО (Next.js side)

### 1. TypeScript Interfaces (`types/index.ts`) ✅
- Всі content interfaces для 5 сторінок
- Shared interfaces: Navbar, Footer
- WP Options interfaces: WPNavbarOptions, WPFooterOptions, WPSiteOptions
- Block attributes interfaces (`types/wp-blocks.ts`)

### 2. API Functions (`lib/api.ts`) ✅ (hardcoded fallback)
- `getHomepageContent()`, `getMembershipsPageContent()`, `getPrivateEventsPageContent()`
- `getAboutPageContent()`, `getCareersPageContent()`, `getNavbarContent()`, `getFooterContent()`

### 3. WordPress GraphQL API (`lib/wp-api.ts`) ✅
- `getPageBlocks(slug)` — блоки сторінки через WPGraphQL
- `getPageBySlug(slug)` — для динамічного `[slug]` роуту
- `getAllPageSlugs()` — для `generateStaticParams`
- `getJobs()`, `getMembershipPlans()`, `getTestimonials()`, `getLocations()`, `getPrograms()`
- `getPriceCompareData()`, `getSiteOptions()` — navbar + footer з ACF Options

### 4. GraphQL Queries (`lib/graphql/queries.ts`) ✅
- `GET_PAGE_BY_SLUG` — всі 20 блоків із inline fragments
- `GET_JOBS`, `GET_MEMBERSHIP_PLANS`, `GET_TESTIMONIALS`, `GET_LOCATIONS`, `GET_PROGRAMS`
- `GET_PRICE_COMPARE`, `GET_SITE_OPTIONS` (Navbar + Footer)

### 5. BlockRenderer + 20 Block-компонентів ✅
- `components/blocks/BlockRenderer.tsx` — маппінг `__typename` → компонент
- 20 × `components/blocks/*Block.tsx` — кожна секція site

### 6. Оновлення page.tsx (5 файлів) ✅
- `app/page.tsx` — BlockRenderer + hardcoded fallback (всі секції підключені)
- `app/memberships/page.tsx` — BlockRenderer + fallback
- `app/private-events/page.tsx` — BlockRenderer + fallback
- `app/about/page.tsx` — BlockRenderer + fallback
- `app/careers/page.tsx` — BlockRenderer + fallback (з pre-fetch jobs)
- `app/layout.tsx` — async, getSiteOptions + fallback для Navbar/Footer
- `app/[slug]/page.tsx` — динамічні WP сторінки (Draft = 404)

### 7. Компоненти (всі секції підключені) ✅
**Homepage:**
- ✅ HeroSection, AboutSection, LocationsSection, ProgramsSection
- ✅ HomeSubscriptionsSection, TestimonialsSection, EventsSection
- (MembershipSection схована за запитом Алекса — код збережено)

**Memberships:**
- ✅ HeroMembership, SubscriptionsSection
- (PriceCompareSection схована за запитом Алекса)

**Private Events:** ✅ HeroPrivateEvents, GallerySection, LogoSection

**About:** ✅ HeroAbout, MissionSection, LocationsSection (shared), ContactSection

**Careers:** ✅ HeroCareers, JobListingsSection, CareerContactSection

**Shared:** ✅ Navbar, Footer

### 8. ISR Webhook (Phase 6) ✅
- `app/api/revalidate/route.ts` — Next.js endpoint
- `wp/inc/revalidate-webhook.php` — WordPress side (все CPT + status transitions + ACF options)

### 9. Динамічні сторінки (Phase 7) ✅
- `app/[slug]/page.tsx` — Draft=404, нові WP сторінки → auto-live
- `lib/wp-api.ts` — `getAllPageSlugs()`, `getPageBySlug()`

### 10. ACF Options (Phase 8) ✅
- `wp/inc/theme-setup.php` — ACF Options Pages (Navbar + Footer sub-pages)
- `wp/inc/acf-blocks.php` — ACF field groups для Navbar + Footer options
- `lib/graphql/queries.ts` — GET_SITE_OPTIONS
- `lib/wp-api.ts` — getSiteOptions() з unstable_cache (1 год)
- `app/layout.tsx` — передає WP data в Navbar/Footer з hardcoded fallback

### 11. WordPress PHP theme files ✅
- `wp/inc/acf-blocks.php` — 20 ACF блоків + CPT field groups + Options fields
- `wp/inc/cpt-registration.php` — 6 CPT (job, testimonial, membership, amenity, location, program)
- `wp/inc/theme-setup.php` — block category + ACF options pages
- `wp/inc/graphql-extensions.php` — **v19**: Block/EditorBlock interfaces, flat Rq*Fields, Strategy H runtime resolver
- `wp/inc/revalidate-webhook.php` — ISR webhook + settings page
- `wp/inc/demo-content.php` — Demo Content Importer (Tools → 🎾 Racqueteer Import)
- `wp/functions.php`, `wp/style.css`, `wp/index.php` ✅
- `wp/plugins/racqueteer-demo-content/` — stub plugin (перенаправляє на theme-based importer)

### 12. TypeScript ✅
- `npx tsc --noEmit` → 0 помилок

---

## ⏳ ЗАЛИШИЛОСЬ — ТІЛЬКИ WP ДЕПЛОЙ + ТЕСТУВАННЯ

### Phase 2: Наповнення WordPress (⏳ потрібна дія)

| Крок | Що |
|------|----|
| 1 | Залити `wp/` → `wp-content/themes/racqueteer/` на `racqueteer.websplash.pro` |
| 2 | WP Admin → Appearance → Themes → Activate **Racqueteer** |
| 3 | Встановити плагіни: **ACF PRO**, **WPGraphQL**, **WPGraphQL for ACF**, **WPGraphQL Content Blocks** |
| 4 | WP Admin → Settings → Racqueteer: Next.js URL + Revalidate Secret |
| 5 | WP Admin → Tools → 🎾 Racqueteer Import → **Import Demo Content** |
| 6 | WP Admin → Tools → 🎾 Racqueteer Import → **Verify GraphQL** |

### Phase 9: Тестування (⏳ після деплою)

```
[ ] graphql-extensions.php v19 задеплоєно
[ ] Verify GraphQL → ✅ 20 blocks, ✅ AcfRacqueteerHeroBlock implements Block
[ ] https://racqueteer.websplash.pro/graphql → тест pageBy queries
[ ] git push → Vercel auto-deploy
[ ] Перевірити сторінки рендеряться через блоки (не fallback)
[ ] Змінити текст WP → зберегти → ISR оновлення на фронті (~60с)
[ ] Перевести сторінку в Draft → 404 ✅
[ ] Нова WP сторінка → auto-live ✅
[ ] Змінити Navbar CTA в Site Settings → оновлення ✅
[ ] Lighthouse: Performance ≥ 95, SEO 100
[ ] pnpm build → 0 помилок
```

---

## 📊 Підсумок

| Категорія | Статус |
|-----------|--------|
| Next.js код (всі фази 3–8) | ✅ **100% готово** |
| WordPress PHP theme files | ✅ **100% готово** (в `wp/`) |
| WordPress deployment | ⏳ Потрібно залити на сервер |
| Demo content import | ⏳ Після деплою |
| End-to-end testing | ⏳ Після деплою |
| **Загальна готовність** | **~95%** |

---

## 🔧 Корисні URL

| Сервіс | URL |
|--------|-----|
| GitHub | https://github.com/Slava12212/racqueteer |
| Vercel (Next.js) | https://racqueteer.vercel.app |
| WordPress | https://racqueteer.websplash.pro |
| WP Admin | https://racqueteer.websplash.pro/wp-admin/ |
| WP GraphQL | https://racqueteer.websplash.pro/graphql |
| WP Settings | https://racqueteer.websplash.pro/wp-admin/options-general.php?page=racqueteer-settings |

---

## 📦 Deliverables — Фінальний стан

| Deliverable | Статус |
|-------------|--------|
| TypeScript interfaces | ✅ Complete |
| lib/api.ts (hardcoded fallback) | ✅ Complete |
| lib/wp-api.ts (WP GraphQL client) | ✅ Complete |
| lib/graphql/queries.ts | ✅ Complete |
| 20 Block components | ✅ Complete |
| BlockRenderer | ✅ Complete |
| All 5 page.tsx + layout.tsx | ✅ Complete |
| [slug]/page.tsx (dynamic pages) | ✅ Complete |
| API revalidate route | ✅ Complete |
| wp/ PHP files (all 6) | ✅ Complete |
| Demo content importer | ✅ Complete |
| TypeScript compilation | ✅ 0 errors |
| WP deployment | ⏳ Manual action needed |
| End-to-end test | ⏳ After WP deployment |
