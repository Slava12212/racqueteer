# 📋 Racqueteer — Інструкція по роботі з сайтом

> Повний гайд: що де знаходиться, як редагувати контент, як правки потрапляють на Vercel.

---

## 🗺️ Архітектура в двох словах

```
WordPress (CMS)                     Next.js (Фронтенд)
racqueteer.websplash.pro   →  GraphQL  →  racqueteer.vercel.app
     ↓ при збереженні
  ISR Webhook  →  Vercel API  →  сторінка оновлюється (~1 сек)
```

| Сервіс | URL | Призначення |
|--------|-----|-------------|
| **Фронтенд (живий сайт)** | https://racqueteer.vercel.app | Те, що бачать відвідувачі |
| **WordPress Admin** | https://racqueteer.websplash.pro/wp-admin/ | Редагування контенту |
| **GitHub** | https://github.com/Slava12212/racqueteer | Код (Next.js + PHP тема) |
| **Vercel Dashboard** | https://vercel.com | Деплой, env vars, логи |

---

## ✏️ Як редагувати контент (WordPress → сайт)

### Звичайний потік: зміна тексту/картинки

1. Зайди у **WP Admin** → **Pages**
2. Обери сторінку (Home / About / Memberships / Careers / Private Events)
3. Натисни на блок → відредагуй поля у правій панелі (ACF sidebar)
4. Натисни **Update** (або **Save Draft**)
5. **Сайт оновиться автоматично через ~1–5 секунд** (ISR webhook)

> ⚠️ Якщо сайт не оновився — зачекай 1 год (ISR кеш `revalidate: 3600`), або зроби ручний revalidate (див. нижче).

---

## 📦 Де що налаштовується

### Хедер (Navbar)

```
WP Admin → Site Settings → Navbar
```

| Поле | Що змінює |
|------|-----------|
| Logo | Логотип у шапці |
| Logo Icon | Маленька іконка логотипу |
| Navigation Links | Пункти меню (Label + URL) |
| CTA Button Text | Текст кнопки "Book a Court" |
| CTA Button URL | Посилання кнопки |

> URL може бути відносним: `/memberships` або абсолютним: `https://...`

### Футер (Footer)

```
WP Admin → Site Settings → Footer
```

| Поле | Що змінює |
|------|-----------|
| Footer Logo | Логотип у футері |
| Email | Контактний email |
| Phone | Телефон |
| CTA Text / URL | Кнопка у футері |
| Menu Links (Repeater) | Посилання у колонці меню |
| Locations (Repeater) | Адреси локацій |
| Legal Links (Repeater) | Privacy Policy / Terms і т.д. |
| Copyright Text | Рядок копірайту |

---

## 🏠 Сторінки та їх блоки

### Home (`/`)

| Блок | ACF назва | Що містить |
|------|-----------|-----------|
| Hero | `racqueteer-hero` | Відео, заголовок, дві CTA-кнопки |
| About | `racqueteer-about` | Два фото, статистика, текст |
| Locations | `racqueteer-locations` | Тягне дані з CPT Locations |
| Programs | `racqueteer-programs` | Тягне з CPT Programs |
| Membership CTA | `racqueteer-membership-cta` | Банер з фоновим фото |
| Subscriptions | `racqueteer-subscriptions` | Тягне з CPT Memberships |
| Testimonials | `racqueteer-testimonials` | Тягне з CPT Testimonials |
| Events | `racqueteer-events` | Відео + картинка |

### Memberships (`/memberships`)

| Блок | ACF назва |
|------|-----------|
| Membership Hero | `racqueteer-membership-hero` |
| Subscriptions Detail | `racqueteer-subscriptions-detail` |
| Price Compare | `racqueteer-price-compare` |

### Private Events (`/private-events`)

| Блок | ACF назва |
|------|-----------|
| Private Events Hero | `racqueteer-private-events-hero` |
| Gallery | `racqueteer-gallery` |
| Logo Marquee | `racqueteer-logo-marquee` |

### About (`/about`)

| Блок | ACF назва |
|------|-----------|
| About Hero | `racqueteer-about-hero` |
| Mission | `racqueteer-mission` |
| Contact | `racqueteer-contact` |

### Careers (`/careers`)

| Блок | ACF назва |
|------|-----------|
| Careers Hero | `racqueteer-careers-hero` |
| Job Listings | `racqueteer-job-listings` |
| Career Contact | `racqueteer-career-contact` |

---

## 👔 Custom Post Types (CPT)

Деякі дані керуються окремими записами, а не блоками:

| CPT | Де в WP Admin | Що відображає на сайті |
|-----|--------------|----------------------|
| **Jobs** | WP Admin → Jobs | Вакансії на сторінці Careers |
| **Testimonials** | WP Admin → Testimonials | Відгуки на Home |
| **Memberships** | WP Admin → Memberships | Плани/ціни |
| **Locations** | WP Admin → Locations | Локації на Home |
| **Programs** | WP Admin → Programs | Програми тренувань |
| **Amenities** | WP Admin → Amenities | Зручності |

### Як додати нову вакансію (Job)

```
WP Admin → Jobs → Add New
  Title: "Head Coach - Padel"
  Job Fields:
    Category: "Coaching"
    Description: "We are looking for..."
→ Publish → сайт оновиться автоматично
```

---

## 🚀 Як правки потрапляють на Vercel

### Автоматичний шлях (ISR Webhook)

```
Ти змінив текст у WP → Save
  ↓
WordPress надсилає POST на:
  https://racqueteer.vercel.app/api/revalidate?secret=TOKEN
  ↓
Next.js скидає кеш конкретної сторінки
  ↓
Наступний відвідувач отримує свіжий контент
```

> **Webhook налаштований у:** `WP Admin → Settings → Racqueteer`
> - Next.js URL: `https://racqueteer.vercel.app`
> - Revalidate Secret: (є у Vercel Environment Variables)

### Ручний revalidate (якщо не оновилось)

```bash
curl -X POST "https://racqueteer.vercel.app/api/revalidate?secret=Racqueteer_ISR_2026_ChangeMe!" \
  -H "Content-Type: application/json" \
  -d '{"path": "/"}'
```

Або замінити `"/"` на потрібний шлях: `"/about"`, `"/careers"`, тощо.

### Код шлях (git push → Vercel)

```
Розробник міняє код (TypeScript/PHP)
  ↓
git add . && git commit -m "опис" && git push
  ↓
Vercel автоматично білдить і деплоїть (~2-3 хв)
  ↓
Живий сайт оновлюється
```

---

## 🖼️ Картинки та медіа

### Завантаження картинок

```
WP Admin → Media → Add New → Upload
```

Після завантаження — скопіюй ID зображення (видно в URL при редагуванні медіа файлу).

### Картинки в блоках

При редагуванні блоку, поле типу Image показує медіа-бібліотеку — обери вже завантажену картинку або завантаж нову прямо там.

> **Важливо:** картинки зберігаються як ID у WordPress. PHP-резолвер (`graphql-extensions.php`) автоматично конвертує ID → URL перед тим, як відправити Next.js.

### Відеофайли

Відео (`videoUrl`, `video_url`) — вводяться як **текстовий URL**:
- `/hero-video-opt.mp4` — файл з папки `public/` Next.js
- `https://cdn.example.com/video.mp4` — зовнішній URL

---

## 🔧 Змінити PHP тему на сервері

PHP-файли теми живуть у двох місцях одночасно:

| Місце | Шлях |
|-------|------|
| **Локально (git)** | `E:\Projects\Leha-main\theme\racqueteer\wp\` |
| **На хостингу** | `wp-content/themes/racqueteer/` |

### Деплой PHP файлів на хостинг

PHP файли **НЕ деплояться через Vercel** — вони йдуть окремо на WordPress-хостинг `racqueteer.websplash.pro`.

**Спосіб 1 — FTP/SFTP:**
```
Host:   racqueteer.websplash.pro
Шлях:   /public_html/wp-content/themes/racqueteer/
```
Залий файли з `wp/inc/`:
- `graphql-extensions.php`
- `acf-blocks.php`
- `cpt-registration.php`
- `revalidate-webhook.php`
- `theme-setup.php`

**Спосіб 2 — WP Admin File Editor (не рекомендовано для великих файлів):**
```
WP Admin → Appearance → Theme File Editor
```

**Спосіб 3 — WP-CLI (якщо є SSH):**
```bash
scp wp/inc/graphql-extensions.php user@host:/public_html/wp-content/themes/racqueteer/inc/
```

### Перевірка версії PHP після деплою

```
WP Admin → Racqueteer Settings → перевір версію резолвера
```
або GraphQL:
```graphql
{ racqueteerDeployVersion }
```

---

## ⚙️ Environment Variables

### На Vercel (Settings → Environment Variables)

| Змінна | Значення |
|--------|---------|
| `NEXT_PUBLIC_WP_GRAPHQL_URL` | `https://racqueteer.websplash.pro/graphql` |
| `NEXT_PUBLIC_WP_REST_URL` | `https://racqueteer.websplash.pro/wp-json` |
| `REVALIDATE_SECRET` | `Racqueteer_ISR_2026_ChangeMe!` |

### Локально (`.env.local` — НЕ в git)

```env
NEXT_PUBLIC_WP_GRAPHQL_URL=https://racqueteer.websplash.pro/graphql
NEXT_PUBLIC_WP_REST_URL=https://racqueteer.websplash.pro/wp-json
REVALIDATE_SECRET=Racqueteer_ISR_2026_ChangeMe!
```

---

## 🐛 Поширені проблеми і рішення

### Сайт показує старий контент

**Причина:** ISR-кеш ще не скинувся (до 1 год)  
**Рішення:** ручний revalidate або зачекати

### Картинка відображається як число (наприклад `src="54"`)

**Причина:** `graphql-extensions.php` стара версія (до v19), яка не конвертує ID → URL  
**Рішення:** Залити на хостинг останню версію `wp/inc/graphql-extensions.php` (v19+)

### Помилка "Значення должно быть допустимым URL" в WP Admin

**Причина:** Поле типу `url` у ACF не приймає відносні шляхи `/memberships`  
**Рішення:** Переконайся що залито нова версія `acf-blocks.php`, де такі поля мають `'type' => 'text'`

### Неправильний логотип у хедері/футері (логотип партнера замість бренду)

**Причина:** WordPress повертає `null` для поля логотипу (не завантажено зображення)  
**Рішення:** Зайди у `WP Admin → Site Settings → Navbar` → завантаж правильний лого бренду у поле Logo

### Вакансії/Testimonials не оновлюються

**Причина:** Компоненти тягнуть дані з WordPress CPT  
**Рішення:** Переконайся що записи опубліковані (не Draft); після збереження - webhook скине кеш

### Vercel не деплоїть після git push

**Перевір:**
1. Vercel Dashboard → Deployments → статус білду  
2. Помилки TypeScript: `pnpm build` локально  
3. Environment Variables налаштовані на Vercel

---

## 📁 Структура Next.js проєкту

```
theme/racqueteer/
  app/                    ← сторінки Next.js
    page.tsx              ← Home (/)
    about/page.tsx        ← /about
    careers/page.tsx      ← /careers
    memberships/page.tsx  ← /memberships
    private-events/       ← /private-events
    [slug]/page.tsx       ← будь-яка нова WP-сторінка
    layout.tsx            ← хедер + футер (Navbar, Footer)
    api/revalidate/       ← ISR endpoint

  components/
    blocks/               ← 20 Block-обгорток (HeroBlock, AboutBlock, etc.)
    careers/              ← компоненти сторінки Careers
    membership/           ← компоненти Memberships
    Navbar.tsx            ← компонент хедера
    Footer.tsx            ← компонент футера

  lib/
    wp-api.ts             ← GraphQL-клієнт (основний джерело даних)
    api.ts                ← hardcoded fallback (якщо WP недоступний)
    graphql/
      queries.ts          ← всі GraphQL-запити
      fragments.ts        ← GraphQL-фрагменти

  public/                 ← статичні файли (відео, SVG, PNG)
  wp/                     ← PHP тема (заливати на хостинг)
    inc/
      graphql-extensions.php  ← ACF → GraphQL резолвер (КРИТИЧНО)
      acf-blocks.php          ← реєстрація блоків і полів
      cpt-registration.php    ← Custom Post Types
      revalidate-webhook.php  ← ISR webhook
      theme-setup.php         ← options pages, плагіни
```

---

## 🔄 Workflow для розробника

### Зміна коду

```powershell
# 1. Запустити локально
cd E:\Projects\Leha-main\theme\racqueteer
pnpm dev   # → http://localhost:3042

# 2. Перевірити збірку перед пушем
pnpm build

# 3. Задеплоїти на Vercel
git add .
git commit -m "fix: опис змін"
git push
# Vercel автоматично деплоїть за ~2-3 хвилини
```

### Зміна PHP теми

```powershell
# Після редагування wp/inc/*.php:
# Залити файли на хостинг через FTP/SFTP
# Перевірити: WP Admin → GraphQL → версія резолвера
```

### Повний цикл оновлення контенту

```
Редактор змінює текст у WP Admin
  → Натискає Save/Update
  → ISR webhook тригериться автоматично
  → Vercel скидає кеш сторінки (~1-5 сек)
  → Живий сайт оновлено ✅
```

---

## 🔑 Ключові файли для розуміння

| Файл | Роль |
|------|------|
| `app/layout.tsx` | Підвантażує navbar/footer з WP, обгортає всі сторінки |
| `app/page.tsx` | Home: рендерить WP-блоки або fallback hardcoded |
| `lib/wp-api.ts` | Всі функції для отримання даних з WordPress GraphQL |
| `lib/api.ts` | Hardcoded fallback — НЕ ЧІПАТИ без потреби |
| `lib/graphql/queries.ts` | GraphQL-запити до WPGraphQL |
| `wp/inc/graphql-extensions.php` | PHP: як ACF-поля конвертуються для GraphQL (вкл. ID→URL картинок) |
| `wp/inc/acf-blocks.php` | PHP: реєстрація всіх 20 блоків і їх полів |
| `wp/inc/revalidate-webhook.php` | PHP: webhook при збереженні → оновлення Vercel |

---

## 📌 Швидкий чеклист при проблемах

```
□ Контент не оновився на сайті?
    → Зберіг зміни у WP Admin? → Update
    → Webhook налаштований? WP Admin → Settings → Racqueteer
    → Ручний revalidate: POST /api/revalidate?secret=...

□ src="54" або зламані картинки?
    → Залити нову версію graphql-extensions.php (v19+) на хостинг

□ "Значення должно быть допустимым URL"?
    → Залити нову версію acf-blocks.php (всі url-поля стали text)

□ Помилка деплою на Vercel?
    → Dashboard → Deployments → переглянути лог
    → Локально: pnpm build → виправити TypeScript помилки

□ WP GraphQL не відповідає?
    → Перевірити плагіни: WPGraphQL + WPGraphQL for ACF активні
    → https://racqueteer.websplash.pro/graphql → має відповісти JSON

□ Немає блоків на сторінці?
    → Перевірити у WP: сторінка опублікована, блоки додані
    → GraphQL query: { pageBy(uri: "/") { blocks { __typename } } }
```

