# WordPress Integration Plan — Variant B: ACF Blocks + Next.js Headless

## Статус виконання

| Фаза | Статус |
|------|--------|
| 0 — Підготовка середовища | ✅ Виконано |
| 1 — ACF Blocks реєстрація (PHP) | ✅ Файли готові, потрібно залити на WP |
| 2 — WP сторінки + наповнення | ⏳ Зробити вручну в WP Admin |
| 3 — GraphQL queries | ✅ Виконано |
| 4 — BlockRenderer + Block-обгортки | ✅ Виконано |
| 5 — Оновлення page.tsx | ⏳ Зробити після п.2 |
| 6 — ISR Webhook | ✅ Виконано |
| 7 — Тестування | ⏳ Зробити після п.2 і п.5 |

---

## Структура проєкту (фактична)

```
E:\Projects\Leha-main\theme\racqueteer\   ← Next.js проєкт (git root)
  app/
  components/
    blocks/           ← всі Block-обгортки ✅
  lib/
    graphql/
      queries.ts      ✅
      fragments.ts    ✅
    api.ts            ← hardcoded fallback (не чіпати)
    wp-api.ts         ✅ GraphQL клієнт з fallback
  types/
    index.ts
    wp-blocks.ts      ✅
  public/
  docs/
  wp/                 ← WordPress тема (заливати на хостинг)
    functions.php
    style.css
    index.php         ← redirect на racqueteer.vercel.app
    inc/
      theme-setup.php
      cpt-registration.php
      acf-blocks.php
      graphql-extensions.php
      revalidate-webhook.php
  package.json
  .env.local          ← НЕ в git (секрети локально і на Vercel)
  .gitignore
```

---

## ФАЗА 0 — Підготовка середовища ✅

### 0.1 WordPress — плагіни для встановлення

> WP Admin: https://racqueteer.websplash.pro/wp-admin/

```
[ ] Advanced Custom Fields PRO   ← реєстрація блоків
[ ] WPGraphQL                    ← GraphQL API
[ ] WPGraphQL for ACF            ← ACF поля в GraphQL схемі
```

### 0.2 `.env.local` ✅

```env
NEXT_PUBLIC_WP_GRAPHQL_URL=https://racqueteer.websplash.pro/graphql
NEXT_PUBLIC_WP_REST_URL=https://racqueteer.websplash.pro/wp-json
REVALIDATE_SECRET=Racqueteer_ISR_2026_ChangeMe!
```

> Файл не в git. На Vercel — додано в Environment Variables.

### 0.3 Деплой ✅

| Сервіс | URL |
|--------|-----|
| GitHub | https://github.com/Slava12212/racqueteer |
| Vercel (Next.js) | https://racqueteer.vercel.app |
| WordPress | https://racqueteer.websplash.pro |
| WP Admin | https://racqueteer.websplash.pro/wp-admin/ |
| WP Racqueteer Settings | https://racqueteer.websplash.pro/wp-admin/options-general.php?page=racqueteer-settings |

> Vercel автоматично деплоїть при кожному `git push` до гілки `main`.

---

## ФАЗА 1 — WordPress: ACF Blocks ✅ (файли готові)

### Що потрібно зробити зараз

```
[ ] 1. Залити папку wp/ → wp-content/themes/racqueteer/ на хостинг
[ ] 2. Активувати тему: WP Admin → Appearance → Themes → Racqueteer
[ ] 3. Встановити плагіни з п.0.1
[ ] 4. WP Admin → Settings → Racqueteer:
        Next.js URL:        https://racqueteer.vercel.app
        Revalidate Secret:  Racqueteer_ISR_2026_ChangeMe!
```

### Маппінг: компонент → ACF Block → файл ✅

| Next.js компонент | Gutenberg блок | Block-файл |
|---|---|---|
| `HeroSection` | `acf/racqueteer-hero` | `components/blocks/HeroBlock.tsx` |
| `AboutSection` | `acf/racqueteer-about` | `components/blocks/AboutBlock.tsx` |
| `LocationsSection` | `acf/racqueteer-locations` | `components/blocks/LocationsBlock.tsx` |
| `ProgramsSection` | `acf/racqueteer-programs` | `components/blocks/ProgramsBlock.tsx` |
| `MembershipSection` | `acf/racqueteer-membership-cta` | `components/blocks/MembershipCtaBlock.tsx` |
| `HomeSubscriptionsSection` | `acf/racqueteer-subscriptions` | `components/blocks/SubscriptionsBlock.tsx` |
| `TestimonialsSection` | `acf/racqueteer-testimonials` | `components/blocks/TestimonialsBlock.tsx` |
| `EventsSection` | `acf/racqueteer-events` | `components/blocks/EventsBlock.tsx` |
| `HeroMembership` | `acf/racqueteer-membership-hero` | `components/blocks/MembershipHeroBlock.tsx` |
| `SubscriptionsSection` | `acf/racqueteer-subscriptions-detail` | `components/blocks/SubscriptionsDetailBlock.tsx` |
| `PriceCompareSection` | `acf/racqueteer-price-compare` | `components/blocks/PriceCompareBlock.tsx` |
| `HeroPrivateEvents` | `acf/racqueteer-private-events-hero` | `components/blocks/PrivateEventsHeroBlock.tsx` |
| `GallerySection` | `acf/racqueteer-gallery` | `components/blocks/GalleryBlock.tsx` |
| `LogoSection` | `acf/racqueteer-logo-marquee` | `components/blocks/LogoMarqueeBlock.tsx` |
| `HeroAbout` | `acf/racqueteer-about-hero` | `components/blocks/AboutHeroBlock.tsx` |
| `MissionSection` | `acf/racqueteer-mission` | `components/blocks/MissionBlock.tsx` |
| `ContactSection` | `acf/racqueteer-contact` | `components/blocks/ContactBlock.tsx` |
| `HeroCareers` | `acf/racqueteer-careers-hero` | `components/blocks/CareersHeroBlock.tsx` |
| `JobListingsSection` | `acf/racqueteer-job-listings` | `components/blocks/JobListingsBlock.tsx` |
| `CareerContactSection` | `acf/racqueteer-career-contact` | `components/blocks/CareerContactBlock.tsx` |

### Custom Post Types ✅ (`wp/inc/cpt-registration.php`)

| CPT | Призначення |
|-----|-------------|
| `job` | Вакансії (Careers) |
| `testimonial` | Відгуки |
| `membership` | Плани членства |
| `amenity` | Зручності |
| `location` | Локації |
| `program` | Програми/кліники |

---

## ФАЗА 2 — WordPress: сторінки з блоками ⏳

Після заливки теми і активації плагінів — створити сторінки:

| Сторінка | Slug | Блоки |
|---|---|---|
| Home | `/` | hero, about, locations, programs, membership-cta, subscriptions, testimonials, events |
| Memberships | `/memberships` | membership-hero, subscriptions-detail, price-compare |
| Private Events | `/private-events` | private-events-hero, gallery, logo-marquee |
| About | `/about` | about-hero, mission, contact |
| Careers | `/careers` | careers-hero, job-listings, career-contact |

**Як додати блок:**
1. WP Admin → Pages → Edit сторінку
2. Натиснути `+` в Gutenberg редакторі
3. Категорія **Racqueteer** → вибрати блок
4. Заповнити поля в sidebar → Save

---

## ФАЗА 3 — GraphQL Queries ✅

| Файл | Статус |
|------|--------|
| `lib/graphql/queries.ts` | ✅ |
| `lib/graphql/fragments.ts` | ✅ |
| `lib/wp-api.ts` | ✅ з автоматичним fallback на `lib/api.ts` |

> Fallback: якщо WP GraphQL недоступний — повертаються hardcoded дані. Сайт не ламається.

---

## ФАЗА 4 — Block Renderer ✅

| Файл | Статус |
|------|--------|
| `components/blocks/BlockRenderer.tsx` | ✅ |
| 20 × `components/blocks/*Block.tsx` | ✅ |

---

## ФАЗА 5 — Оновлення app/*/page.tsx ⏳

Зробити **після** Фази 2 (WP сторінки наповнені).

```typescript
// БУЛО (наприклад app/page.tsx):
import { getHomepageContent } from "@/lib/api";
export default async function HomePage() {
  const content = await getHomepageContent();
  return (
    <>
      <HeroSection content={content.hero} />
      <AboutSection content={content.about} />
      {/* ... */}
    </>
  );
}

// СТАНЕ:
import { getPageBlocks } from "@/lib/wp-api";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const revalidate = 3600; // ISR — кеш на 1 годину

export default async function HomePage() {
  const blocks = await getPageBlocks('/');
  return <BlockRenderer blocks={blocks} />;
}
```

Файли для оновлення:
```
[ ] app/page.tsx
[ ] app/memberships/page.tsx
[ ] app/private-events/page.tsx
[ ] app/about/page.tsx
[ ] app/careers/page.tsx
```

---

## ФАЗА 6 — ISR Webhook ✅

### Next.js side ✅
`app/api/revalidate/route.ts` — готово

Endpoint: `POST https://racqueteer.vercel.app/api/revalidate?secret=TOKEN`

### WordPress side ✅
`wp/inc/revalidate-webhook.php` — при збереженні сторінки автоматично надсилає запит на Vercel.

Налаштування: WP Admin → Settings → Racqueteer:
```
Next.js URL:        https://racqueteer.vercel.app
Revalidate Secret:  Racqueteer_ISR_2026_ChangeMe!
```

---

## ФАЗА 7 — Тестування ⏳

```
[ ] Залити wp/ на хостинг і активувати тему
[ ] Встановити плагіни (ACF PRO, WPGraphQL, WPGraphQL for ACF)
[ ] Налаштувати WP Admin → Settings → Racqueteer
[ ] Створити сторінки в WP з блоками (Фаза 2)
[ ] Оновити page.tsx файли (Фаза 5)
[ ] git push → Vercel задеплоїть автоматично
[ ] Перевірити GraphQL: https://racqueteer.websplash.pro/graphql
[ ] Перевірити що сторінки рендеряться через блоки
[ ] Змінити текст в WP → зберегти → перевірити оновлення на фронті (ISR)
[ ] Lighthouse: Performance ≥ 95, SEO 100
[ ] Немає помилок в консолі браузера
[ ] npm run build — без помилок TypeScript
```

---

## Workflow для розробки

```bash
# Запустити локально
cd E:\Projects\Leha-main\theme\racqueteer
npm run dev        # → http://localhost:3042

# Запушити зміни (Vercel деплоїть автоматично)
git add .
git commit -m "опис змін"
git push
```

---

## ⏱️ Підсумок

| Фаза | Що | Час | Статус |
|------|-----|-----|--------|
| 0 | WP setup + .env + Vercel + GitHub | 0.5 дня | ✅ |
| 1 | ACF Blocks PHP + CPT | 1.5 дні | ✅ файли готові |
| 2 | WP сторінки + наповнення | 0.5 дня | ⏳ |
| 3 | GraphQL queries | 1 день | ✅ |
| 4 | BlockRenderer + 20 Block-обгорток | 2 дні | ✅ |
| 5 | Оновлення page.tsx (5 файлів) | 0.5 дня | ⏳ після п.2 |
| 6 | ISR webhook | 0.5 дня | ✅ |
| 7 | Тестування | 1 день | ⏳ |
| **ВСЬОГО** | | **~7.5 днів** | **~65% готово** |

