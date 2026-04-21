# WordPress Integration Plan — Variant B: ACF Blocks + Next.js Headless

---

## ФАЗА 0 — Підготовка середовища `~0.5 дня`

### 0.1 WordPress встановлення та плагіни
Встановити на сервері (або локально через LocalWP / Laragon):

```
WordPress 6.x
├── Advanced Custom Fields PRO       ← реєстрація блоків
├── WPGraphQL                        ← GraphQL API
├── WPGraphQL for ACF                ← ACF поля в GraphQL схемі
├── WP Webhooks (або custom)         ← тригер ISR при збереженні
└── Classic Editor (ВИМКНУТИ)        ← тільки Gutenberg
```

### 0.2 Налаштувати `.env.local` у Next.js
```env
NEXT_PUBLIC_WP_GRAPHQL_URL=https://cms.racqueteer.com/graphql
NEXT_PUBLIC_WP_REST_URL=https://cms.racqueteer.com/wp-json
REVALIDATE_SECRET=your_secret_token
```

### 0.3 Структура нових файлів у Next.js
```
lib/
  graphql/
    queries.ts        ← всі GraphQL запити
    fragments.ts      ← фрагменти для повторних полів
  wp-api.ts           ← нова версія api.ts (поступова заміна)
components/
  blocks/
    BlockRenderer.tsx
    HeroBlock.tsx
    AboutBlock.tsx
    ...
app/
  api/
    revalidate/
      route.ts        ← ISR webhook
```

---

## ФАЗА 1 — WordPress: реєстрація ACF Blocks `~1.5 дні`

### 1.1 Структура теми / плагіна на WordPress

Створити `mu-plugins/racqueteer-blocks/` (або child theme):

```
racqueteer-blocks/
  racqueteer-blocks.php     ← головний файл, реєстрація всіх блоків
  blocks/
    hero/
      block.json            ← метадані блока
      fields.php            ← ACF field group
    programs/
    locations/
    memberships/
    testimonials/
    amenities/
    events/
    about-section/
    careers-hero/
    private-events-hero/
    gallery/
    logo-marquee/
```

### 1.2 Маппінг: компонент → ACF Block

| Next.js компонент | Gutenberg блок | ACF поля |
|---|---|---|
| `HeroSection` | `racqueteer/hero` | title, description, cta_primary_text, cta_primary_url, cta_secondary_text, video_url |
| `AboutSection` | `racqueteer/about` | label, title, description, stat1_number, stat1_label, stat2_number, stat2_label, left_image, right_image |
| `LocationsSection` | `racqueteer/locations` | label, title, description + Repeater: locations[] |
| `ProgramsSection` | `racqueteer/programs` | label, title, description, tabs + Repeater: programs[] |
| `MembershipSection` | `racqueteer/membership-cta` | label, title, description, cta_text, cta_url, bg_image |
| `HomeSubscriptionsSection` | `racqueteer/subscriptions` | label, title, description |
| `TestimonialsSection` | `racqueteer/testimonials` | label, title, description |
| `EventsSection` | `racqueteer/events` | title, description, cta_text, cta_url, image |
| `HeroMembership` | `racqueteer/membership-hero` | label, title, description, price, video_url |
| `SubscriptionsSection` | `racqueteer/subscriptions-detail` | — (дані з CPT) |
| `PriceCompareSection` | `racqueteer/price-compare` | — (дані з CPT) |
| `HeroPrivateEvents` | `racqueteer/private-events-hero` | label, title, description, cta_text, video_url |
| `GallerySection` | `racqueteer/gallery` | label, title, description + images[] |
| `LogoSection` | `racqueteer/logo-marquee` | label, title + logos[] |
| `HeroAbout` | `racqueteer/about-hero` | label, title, description, video_url |
| `MissionSection` | `racqueteer/mission` | label, title, description, image |
| `ContactSection` | `racqueteer/contact` | label, title, email, phone, cta_text |
| `HeroCareers` | `racqueteer/careers-hero` | label, title, description, video_url |
| `JobListingsSection` | `racqueteer/job-listings` | label, title, description |
| `CareerContactSection` | `racqueteer/career-contact` | label, title, description, cta_text, image |

### 1.3 Приклад реєстрації блока (PHP)

```php
// blocks/hero/fields.php
add_action('acf/init', function() {
    acf_register_block_type([
        'name'            => 'racqueteer-hero',
        'title'           => 'Hero Section',
        'description'     => 'Головна hero секція з відео',
        'category'        => 'racqueteer',
        'icon'            => 'cover-image',
        'keywords'        => ['hero', 'banner'],
        'supports'        => ['jsx' => true],
        'render_callback' => '__return_empty_string', // headless — рендер на фронті
    ]);

    acf_add_local_field_group([
        'key'    => 'group_hero',
        'title'  => 'Hero Block Fields',
        'fields' => [
            ['key' => 'field_hero_title',        'label' => 'Title',       'name' => 'title',       'type' => 'text'],
            ['key' => 'field_hero_description',  'label' => 'Description', 'name' => 'description', 'type' => 'textarea'],
            ['key' => 'field_hero_cta_primary',  'label' => 'CTA Primary', 'name' => 'cta_primary', 'type' => 'link'],
            ['key' => 'field_hero_video',        'label' => 'Video URL',   'name' => 'video_url',   'type' => 'url'],
        ],
        'location' => [[ ['param' => 'block', 'operator' => '==', 'value' => 'acf/racqueteer-hero'] ]],
    ]);
});
```

### 1.4 Custom Post Types для динамічних даних

```php
// CPTs які реєструємо окремо (не як блоки — дані, не layout)
register_post_type('job',          [...]);   // Вакансії
register_post_type('testimonial',  [...]);   // Відгуки
register_post_type('membership',   [...]);   // Плани членства
register_post_type('amenity',      [...]);   // Зручності
register_post_type('location',     [...]);   // Локації
register_post_type('program',      [...]);   // Програми/кліники
```

---

## ФАЗА 2 — WordPress: сторінки з блоками `~0.5 дня`

### 2.1 Створити сторінки в WordPress

| WordPress сторінка | slug | Блоки які додаємо |
|---|---|---|
| Home | `/` | hero, about, locations, programs, membership-cta, subscriptions, testimonials, events |
| Memberships | `/memberships` | membership-hero, subscriptions-detail, price-compare |
| Private Events | `/private-events` | private-events-hero, gallery, logo-marquee |
| About | `/about` | about-hero, mission, contact |
| Careers | `/careers` | careers-hero, job-listings, career-contact |

### 2.2 Наповнити контентом через Gutenberg

Редактор відкриває сторінку → додає блоки через `+` → вводить контент у поля ACF у sidebar — зберігає. Порядок блоків на сторінці = порядок рендерингу на фронті.

---

## ФАЗА 3 — GraphQL Queries у Next.js `~1 день`

### 3.1 Встановити залежності

```bash
pnpm add graphql-request graphql
```

### 3.2 `lib/graphql/fragments.ts`

```typescript
export const HERO_FIELDS = `
  fragment HeroFields on AcfRacqueteerHeroBlock {
    title
    description
    ctaPrimaryText: cta_primary_text
    ctaPrimaryUrl: cta_primary_url
    ctaSecondaryText: cta_secondary_text
    videoUrl: video_url
  }
`;
// ... аналогічно для кожного блока
```

### 3.3 `lib/graphql/queries.ts`

```typescript
export const GET_PAGE_BY_SLUG = `
  query GetPage($slug: String!) {
    pageBy(uri: $slug) {
      title
      blocks {
        name
        ... on AcfRacqueteerHeroBlock {
          attributes { title description ctaPrimaryText videoUrl }
        }
        ... on AcfRacqueteerProgramsBlock {
          attributes {
            label title description
            programs { title color price unit description }
          }
        }
        ... on AcfRacqueteerLocationsBlock {
          attributes {
            label title description
            locations { id name status address description image }
          }
        }
        # ... решта блоків
      }
    }
  }
`;

export const GET_JOBS = `
  query GetJobs {
    jobs(first: 100) {
      nodes {
        id
        title
        acf { description category }
        date
      }
    }
  }
`;

export const GET_MEMBERSHIP_PLANS = `
  query GetMembershipPlans {
    memberships(first: 10) {
      nodes {
        title
        acf { price description buttonVariant features }
      }
    }
  }
`;
// GET_TESTIMONIALS, GET_AMENITIES, GET_LOCATIONS, GET_PROGRAMS...
```

### 3.4 `lib/wp-api.ts` — оновлена версія api.ts

```typescript
import { GraphQLClient } from 'graphql-request';
import { GET_PAGE_BY_SLUG, GET_JOBS, GET_MEMBERSHIP_PLANS } from './graphql/queries';

const client = new GraphQLClient(process.env.NEXT_PUBLIC_WP_GRAPHQL_URL!);

// Отримати блоки сторінки
export async function getPageBlocks(slug: string): Promise<WPBlock[]> {
  const data = await client.request(GET_PAGE_BY_SLUG, { slug });
  return data.pageBy?.blocks ?? [];
}

// Динамічні CPT дані
export async function getJobs(): Promise<Job[]> {
  const data = await client.request(GET_JOBS);
  return data.jobs.nodes.map((node: any) => ({
    id: node.id,
    title: node.title,
    description: node.acf.description,
    category: node.acf.category,
    date: new Date(node.date).toLocaleDateString('en-AU', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }));
}
// getMembershipPlans(), getTestimonials(), getAmenities()...
```

---

## ФАЗА 4 — Block Renderer у Next.js `~2 дні`

### 4.1 `components/blocks/BlockRenderer.tsx`

```typescript
// Server Component — приймає масив блоків, рендерить відповідні компоненти
import dynamic from 'next/dynamic';

const BLOCK_MAP: Record<string, React.ComponentType<any>> = {
  'acf/racqueteer-hero':            dynamic(() => import('./HeroBlock')),
  'acf/racqueteer-about':           dynamic(() => import('./AboutBlock')),
  'acf/racqueteer-programs':        dynamic(() => import('./ProgramsBlock')),
  'acf/racqueteer-locations':       dynamic(() => import('./LocationsBlock')),
  'acf/racqueteer-membership-cta':  dynamic(() => import('./MembershipBlock')),
  'acf/racqueteer-subscriptions':   dynamic(() => import('./SubscriptionsBlock')),
  'acf/racqueteer-testimonials':    dynamic(() => import('./TestimonialsBlock')),
  'acf/racqueteer-events':          dynamic(() => import('./EventsBlock')),
  // ... решта
};

export default function BlockRenderer({ blocks }: { blocks: WPBlock[] }) {
  return (
    <>
      {blocks.map((block, i) => {
        const Component = BLOCK_MAP[block.name];
        if (!Component) return null;
        return <Component key={i} {...block.attributes} />;
      })}
    </>
  );
}
```

### 4.2 Кожен Block = тонка обгортка над існуючим компонентом

```typescript
// components/blocks/HeroBlock.tsx
// НЕ переписуємо HeroSection — просто маппимо props
import HeroSection from '@/components/HeroSection';
import type { WPHeroAttributes } from '@/types/wp-blocks';

export default function HeroBlock(attrs: WPHeroAttributes) {
  return (
    <HeroSection
      title={attrs.title}
      description={attrs.description}
      ctaPrimaryText={attrs.ctaPrimaryText}
      ctaPrimaryUrl={attrs.ctaPrimaryUrl}
      ctaSecondaryText={attrs.ctaSecondaryText}
      ctaSecondaryUrl={attrs.ctaSecondaryUrl}
      videoUrl={attrs.videoUrl}
    />
  );
}
```

> ⚡ **Ключова ідея:** всі існуючі компоненти (`HeroSection`, `ProgramsSection` тощо) **не чіпаємо**. Block-обгортки тільки перекладають WP-дані у вже відомі props.

### 4.3 Новий тип `types/wp-blocks.ts`

```typescript
export interface WPBlock {
  name: string;
  attributes: Record<string, any>;
}

export interface WPHeroAttributes {
  title: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryUrl: string;
  ctaSecondaryText: string;
  ctaSecondaryUrl: string;
  videoUrl: string;
}
// ... WPProgramsAttributes, WPLocationsAttributes, etc.
```

---

## ФАЗА 5 — Оновлення app/*/page.tsx `~0.5 дня`

### До (hardcoded):
```typescript
// app/page.tsx
import { getHomepageContent } from "@/lib/api";
export default async function HomePage() {
  const content = await getHomepageContent();
  return <HeroSection title={content.hero.title} ... />
}
```

### Після (blocks):
```typescript
// app/page.tsx
import { getPageBlocks } from "@/lib/wp-api";
import BlockRenderer from "@/components/blocks/BlockRenderer";

export const revalidate = 3600; // ISR — оновлення кожну годину

export default async function HomePage() {
  const blocks = await getPageBlocks('/');
  return <BlockRenderer blocks={blocks} />;
}
```

> Зміна **мінімальна** — тільки `page.tsx` файли. Всі компоненти залишаються незмінними.

---

## ФАЗА 6 — ISR Webhook `~0.5 дня`

### `app/api/revalidate/route.ts`

```typescript
import { revalidatePath } from 'next/cache';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret');
  if (secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ error: 'Invalid token' }, { status: 401 });
  }

  const { slug } = await req.json();
  revalidatePath(slug || '/');

  return Response.json({ revalidated: true, slug });
}
```

### WordPress side:
- Плагін **WP Webhooks** → при `post_updated` → POST `https://racqueteer.com/api/revalidate?secret=TOKEN`
- Body: `{ "slug": "/memberships" }`

---

## ФАЗА 7 — Тестування `~1 день`

### Чеклист:
```
□ Кожна сторінка рендериться через блоки (не hardcoded)
□ Редактор WP може змінити текст → зберегти → Next.js оновлюється (ISR)
□ Редактор може змінити порядок блоків → зберегти → фронт відображає новий порядок
□ GraphQL запити повертають правильні дані
□ Lighthouse: Performance ≥ 95, SEO 100
□ console.log — немає помилок
□ TypeScript — немає помилок (pnpm build)
□ Fallback до hardcoded даних якщо WP недоступний
```

---

## 📊 Загальний чеклист файлів для створення/змін

| Файл | Дія |
|------|-----|
| `lib/graphql/queries.ts` | **Створити** |
| `lib/graphql/fragments.ts` | **Створити** |
| `lib/wp-api.ts` | **Створити** |
| `types/wp-blocks.ts` | **Створити** |
| `components/blocks/BlockRenderer.tsx` | **Створити** |
| `components/blocks/HeroBlock.tsx` | **Створити** |
| `components/blocks/*Block.tsx` (×18) | **Створити** |
| `app/api/revalidate/route.ts` | **Створити** |
| `app/page.tsx` | **Оновити** (5 рядків) |
| `app/memberships/page.tsx` | **Оновити** (5 рядків) |
| `app/private-events/page.tsx` | **Оновити** (5 рядків) |
| `app/about/page.tsx` | **Оновити** (5 рядків) |
| `app/careers/page.tsx` | **Оновити** (5 рядків) |
| `lib/api.ts` | **Залишити** як fallback |
| `components/*` (всі існуючі) | **НЕ ЧІПАТИ** ✅ |

---

## ⏱️ Підсумок по часу

| Фаза | Що | Час |
|------|-----|-----|
| 0 | WP setup + .env | 0.5 дня |
| 1 | ACF Blocks реєстрація (PHP) | 1.5 дні |
| 2 | WP сторінки + наповнення | 0.5 дня |
| 3 | GraphQL queries | 1 день |
| 4 | BlockRenderer + 18 Block-обгорток | 2 дні |
| 5 | Оновлення page.tsx (5 файлів) | 0.5 дня |
| 6 | ISR webhook | 0.5 дня |
| 7 | Тестування | 1 день |
| **ВСЬОГО** | | **~7.5 робочих днів** |

