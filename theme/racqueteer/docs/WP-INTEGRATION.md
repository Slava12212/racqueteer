# WordPress Integration Plan — Variant B: ACF Blocks + Next.js Headless

## Статус виконання

| Фаза | Статус |
|------|--------|
| 0 — Підготовка середовища | ✅ Виконано |
| 1 — ACF Blocks реєстрація (PHP) | ✅ Файли готові, потрібно залити на WP |
| 2 — WP сторінки + наповнення | ✅ Автоматично через Demo Content Importer плагін |
| 3 — GraphQL queries | ✅ Виконано |
| 4 — BlockRenderer + Block-обгортки | ✅ Виконано |
| 5 — Оновлення page.tsx | ✅ Виконано (BlockRenderer + fallback на hardcoded) |
| 6 — ISR Webhook | ✅ Виконано |
| 7 — Динамічні сторінки (Draft=404, нові=auto-live) | ✅ Виконано |
| 8 — ACF Options Page (Navbar + Footer) | ✅ Виконано |
| 9 — Тестування | ⏳ Зробити після заливки теми і запуску плагіну |

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

## ФАЗА 7 — Динамічні сторінки: Draft = 404, нові = auto-live ✅

> **Мета:** будь-яка нова сторінка у WP автоматично з'являється на racqueteer.com, переведення у Draft = сторінка повертає 404.

### 7.1 Динамічний роут у Next.js

Створити файл `app/[slug]/page.tsx`:

```typescript
import { getPageBySlug, getAllPageSlugs } from '@/lib/wp-api';
import BlockRenderer from '@/components/blocks/BlockRenderer';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

// Дозволяє серверу генерувати сторінки "на льоту" (не тільки при білді)
export const dynamicParams = true;
export const revalidate = 3600;

// Генерує статичні сторінки при білді для вже існуючих WP сторінок
export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs.map(slug => ({ slug }));
}

// Metadata з WP
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const page = await getPageBySlug(params.slug);
  if (!page) return {};
  return {
    title: `${page.title} — Racqueteer`,
    description: page.seoDescription,
  };
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  const page = await getPageBySlug(params.slug);

  // Draft або не існує → 404
  if (!page || page.status !== 'publish') return notFound();

  return <BlockRenderer blocks={page.blocks} />;
}
```

### 7.2 Додати функції у `lib/wp-api.ts`

```typescript
// Отримати всі опубліковані slugs (для generateStaticParams)
export async function getAllPageSlugs(): Promise<string[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_WP_REST_URL}/wp/v2/pages?status=publish&per_page=100&_fields=slug`,
    { next: { revalidate: 3600 } }
  );
  if (!res.ok) return [];
  const pages = await res.json();
  return pages.map((p: { slug: string }) => p.slug);
}

// Отримати сторінку за slug із статусом і блоками
export async function getPageBySlug(slug: string) {
  const query = `
    query GetPageBySlug($slug: String!) {
      pageBy(uri: $slug) {
        title
        status
        seo { metaDesc }
        blocks {
          name
          ... on AcfRacqueteerHeroBlock { attributes { title description videoUrl ctaPrimaryText ctaPrimaryUrl } }
          # ... решта блоків як у GET_PAGE_BLOCKS
        }
      }
    }
  `;
  try {
    const data = await wpGraphQL(query, { slug });
    const page = data?.pageBy;
    if (!page) return null;
    return {
      title: page.title,
      status: page.status,          // 'publish' | 'draft' | 'trash'
      seoDescription: page.seo?.metaDesc ?? '',
      blocks: page.blocks ?? [],
    };
  } catch {
    return null;
  }
}
```

### 7.3 Webhook — оновлення при Draft/Publish

`wp/inc/revalidate-webhook.php` вже надсилає POST при `save_post` — додати обробку статусу:

```php
// wp/inc/revalidate-webhook.php — доповнення
add_action('transition_post_status', function($new_status, $old_status, $post) {
    if ($post->post_type !== 'page') return;
    // Тригерить при будь-якій зміні статусу (draft ↔ publish)
    racqueteer_send_revalidate($post->post_name);
}, 10, 3);
```

### 7.4 Як це працює

```
Сценарій А — нова сторінка:
  WP Admin → Add New Page → slug: /summer-camp → Published
      → webhook → revalidatePath('/summer-camp')
      → перший відвідувач: Next.js генерує сторінку (~300ms)
      → всі наступні: статична сторінка (миттєво)

Сценарій Б — приховати сторінку:
  WP Admin → Edit Page → Switch to Draft → Update
      → webhook → revalidatePath('/memberships')
      → Next.js: status === 'draft' → notFound() → 404
      → racqueteer.com/memberships → сторінка 404 ✅

Сценарій В — повернути сторінку:
  WP Admin → Edit Page → Publish → Update
      → webhook → revalidatePath('/memberships')
      → racqueteer.com/memberships → сторінка знову live ✅
```

### 7.5 Статус (виконано)

```
[x] app/[slug]/page.tsx                  ← СТВОРЕНО
[x] lib/wp-api.ts                        ← getAllPageSlugs(), getPageBySlug() додано
[x] wp/inc/revalidate-webhook.php        ← transition_post_status hook додано
```

---

## ФАЗА 8 — ACF Options Page: редагування Navbar та Footer ✅

> **Мета:** редактор може змінювати посилання, текст і дані у хедері та футері прямо з WP Admin без участі розробника.

### 8.1 Реєстрація Options Page у PHP

Додати у `wp/inc/theme-setup.php`:

```php
// ACF Options Page — глобальні налаштування сайту
add_action('acf/init', function() {
    if (!function_exists('acf_add_options_page')) return;

    acf_add_options_page([
        'page_title' => 'Racqueteer Settings',
        'menu_title' => 'Site Settings',
        'menu_slug'  => 'racqueteer-settings',
        'capability' => 'manage_options',
        'icon_url'   => 'dashicons-admin-settings',
        'position'   => 2,
    ]);

    acf_add_options_sub_page([
        'page_title'  => 'Navbar Settings',
        'menu_title'  => 'Navbar',
        'parent_slug' => 'racqueteer-settings',
    ]);

    acf_add_options_sub_page([
        'page_title'  => 'Footer Settings',
        'menu_title'  => 'Footer',
        'parent_slug' => 'racqueteer-settings',
    ]);
});
```

### 8.2 ACF поля — Navbar

```php
acf_add_local_field_group([
    'key'    => 'group_navbar',
    'title'  => 'Navbar Settings',
    'fields' => [
        // Логотип
        ['key' => 'field_nav_logo',       'name' => 'nav_logo',       'label' => 'Logo',          'type' => 'image'],
        // Головне меню — Repeater
        ['key' => 'field_nav_links', 'name' => 'nav_links', 'label' => 'Navigation Links', 'type' => 'repeater',
         'sub_fields' => [
            ['key' => 'field_nav_link_label', 'name' => 'label', 'label' => 'Label', 'type' => 'text'],
            ['key' => 'field_nav_link_url',   'name' => 'url',   'label' => 'URL',   'type' => 'url'],
         ]
        ],
        // CTA кнопка
        ['key' => 'field_nav_cta_text', 'name' => 'nav_cta_text', 'label' => 'CTA Button Text', 'type' => 'text'],
        ['key' => 'field_nav_cta_url',  'name' => 'nav_cta_url',  'label' => 'CTA Button URL',  'type' => 'url'],
    ],
    'location' => [[ ['param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-navbar'] ]],
]);
```

### 8.3 ACF поля — Footer

```php
acf_add_local_field_group([
    'key'    => 'group_footer',
    'title'  => 'Footer Settings',
    'fields' => [
        // Логотип
        ['key' => 'field_footer_logo',  'name' => 'footer_logo',  'label' => 'Footer Logo', 'type' => 'image'],
        // Короткий текст під логотипом
        ['key' => 'field_footer_desc',  'name' => 'footer_description', 'label' => 'Description', 'type' => 'textarea'],
        // Колонки меню — Repeater
        ['key' => 'field_footer_cols', 'name' => 'footer_columns', 'label' => 'Menu Columns', 'type' => 'repeater',
         'sub_fields' => [
            ['key' => 'field_footer_col_title', 'name' => 'title',  'label' => 'Column Title', 'type' => 'text'],
            ['key' => 'field_footer_col_links',  'name' => 'links',  'label' => 'Links',        'type' => 'repeater',
             'sub_fields' => [
                ['key' => 'field_footer_link_label', 'name' => 'label', 'label' => 'Label', 'type' => 'text'],
                ['key' => 'field_footer_link_url',   'name' => 'url',   'label' => 'URL',   'type' => 'url'],
             ]
            ],
         ]
        ],
        // Соцмережі
        ['key' => 'field_footer_instagram', 'name' => 'social_instagram', 'label' => 'Instagram URL', 'type' => 'url'],
        ['key' => 'field_footer_facebook',  'name' => 'social_facebook',  'label' => 'Facebook URL',  'type' => 'url'],
        ['key' => 'field_footer_tiktok',    'name' => 'social_tiktok',    'label' => 'TikTok URL',    'type' => 'url'],
        // Copyright
        ['key' => 'field_footer_copyright', 'name' => 'footer_copyright', 'label' => 'Copyright Text', 'type' => 'text'],
    ],
    'location' => [[ ['param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-footer'] ]],
]);
```

### 8.4 GraphQL query для Options

Додати у `lib/graphql/queries.ts`:

```typescript
export const GET_SITE_OPTIONS = `
  query GetSiteOptions {
    acfOptionsNavbar {
      navbar {
        navLogo { sourceUrl altText }
        navLinks { label url }
        navCtaText
        navCtaUrl
      }
    }
    acfOptionsFooter {
      footer {
        footerLogo { sourceUrl altText }
        footerDescription
        footerColumns {
          title
          links { label url }
        }
        socialInstagram
        socialFacebook
        socialTiktok
        footerCopyright
      }
    }
  }
`;
```

### 8.5 Оновити `lib/wp-api.ts`

```typescript
export async function getSiteOptions() {
  try {
    const data = await wpGraphQL(GET_SITE_OPTIONS);
    return {
      navbar: data?.acfOptionsNavbar?.navbar ?? null,
      footer: data?.acfOptionsFooter?.footer ?? null,
    };
  } catch {
    return { navbar: null, footer: null }; // fallback — hardcoded дані в компоненті
  }
}
```

### 8.6 Оновити `app/layout.tsx` — передати дані в Navbar і Footer

```typescript
// app/layout.tsx
import { getSiteOptions } from '@/lib/wp-api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default async function RootLayout({ children }) {
  const { navbar, footer } = await getSiteOptions();

  return (
    <html lang="en">
      <body>
        <Navbar data={navbar} />   {/* якщо navbar === null → компонент використовує hardcoded */}
        {children}
        <Footer data={footer} />
      </body>
    </html>
  );
}
```

### 8.7 ISR для Options — revalidate при зміні

```php
// wp/inc/revalidate-webhook.php — доповнення
add_action('acf/save_post', function($post_id) {
    // Options page має спеціальний post_id
    if ($post_id === 'options' || str_contains((string)$post_id, 'options')) {
        racqueteer_send_revalidate('/');          // оновити всі сторінки через layout
        racqueteer_send_revalidate('/_layout');   // або спеціальний тег
    }
});
```

### 8.8 Де в WP Admin

```
WP Admin (sidebar)
  └─ Site Settings              ← головна
       ├─ Navbar                ← редагувати логотип, посилання, CTA
       └─ Footer                ← редагувати логотип, колонки, соцмережі, copyright
```

### 8.9 Статус (виконано)

```
[x] wp/inc/theme-setup.php               ← acf_add_options_page() додано
[x] wp/inc/acf-blocks.php                ← поля Navbar + Footer додано
[x] wp/inc/revalidate-webhook.php        ← acf/save_post hook додано
[x] lib/graphql/queries.ts               ← GET_SITE_OPTIONS додано
[x] lib/wp-api.ts                        ← getSiteOptions() додано
[x] app/layout.tsx                       ← передає data в Navbar/Footer
[x] components/Navbar.tsx                ← приймає content prop з fallback
[x] components/Footer.tsx                ← приймає content prop з fallback
```

---

## ФАЗА 9 — Тестування ⏳

```
[ ] Залити wp/ на хостинг і активувати тему
[ ] Встановити плагіни (ACF PRO, WPGraphQL, WPGraphQL for ACF)
[ ] Налаштувати WP Admin → Settings → Racqueteer (Next.js URL + secret)
[ ] Завантажити і активувати плагін racqueteer-demo-content
[ ] WP Admin → Tools → Racqueteer Import → Import Demo Content
[ ] git push → Vercel задеплоїть автоматично
[ ] Перевірити GraphQL: https://racqueteer.websplash.pro/graphql
[ ] Перевірити що сторінки рендеряться через блоки
[ ] Змінити текст в WP → зберегти → перевірити оновлення на фронті (ISR)
[ ] Перевести сторінку в Draft → racqueteer.com/slug → 404 ✅
[ ] Створити нову WP сторінку → racqueteer.com/new-slug → auto-live ✅
[ ] Змінити Navbar links в Site Settings → оновлення на фронті ✅
[ ] Змінити Footer copyright в Site Settings → оновлення на фронті ✅
[ ] Lighthouse: Performance ≥ 95, SEO 100
[ ] Немає помилок в консолі браузера
[ ] pnpm build — без помилок TypeScript
```

---

## Demo Content Importer Plugin

> `wp/plugins/racqueteer-demo-content/racqueteer-demo-content.php`

Плагін автоматично створює **весь** демо-контент одним кліком.

### Що створює

| Тип | Що |
|---|---|
| Pages (5) | Home, Memberships, Private Events, About, Careers — з ACF блоками |
| Jobs | 8 вакансій (Club Manager, Coach, Barista тощо) |
| Testimonials | 6 відгуків |
| Locations | Homebush + Alexandria |
| Programs | 4 програми тренувань |
| Membership Plans | Starter / Light / Pro / Pro+ |
| ACF Options | Navbar links, Footer contacts/links |
| Media | Завантажує logo, rackets, about-hero, тощо з Next.js CDN |
| Reading Settings | Home встановлюється як front page |

### Установка

```
1. Залити папку wp/plugins/racqueteer-demo-content/ → wp-content/plugins/
2. WP Admin → Plugins → Activate "Racqueteer Demo Content Importer"
3. WP Admin → Settings → Racqueteer → вказати Next.js URL
4. WP Admin → Tools → 🎾 Racqueteer Import → Import Demo Content
```

### Особливості

- **Ідемпотентний** — повторний запуск оновлює, а не дублює
- **Медіа кешується** — зображення не завантажуються двічі
- **Graceful fallback** — якщо Next.js URL не задано, медіа пропускається без помилок
- **Детальний лог** — виводить ✔/⚠ для кожного кроку

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
| 5 | Оновлення page.tsx (5 файлів) | 0.5 дня | ✅ |
| 6 | ISR webhook | 0.5 дня | ✅ |
| 7 | Динамічні сторінки (Draft=404, нові=auto-live) | 0.5 дня | ✅ |
| 8 | ACF Options Page (Navbar + Footer) | 1 день | ✅ |
| 9 | Тестування | 1 день | ⏳ |
| **ВСЬОГО** | | **~9 днів** | **~95% готово** |

