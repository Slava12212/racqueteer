# 🚀 Racqueteer — План передачі проекту клієнту

> Документ для: розробника → клієнт  
> Дата: 2026-05-15  
> Стек: Next.js 14 (Vercel) + WordPress (headless) + WPGraphQL + ACF PRO

---

## 📦 Що входить у проект

| Частина | Опис |
|---------|------|
| `theme/racqueteer/` | Next.js фронтенд-додаток |
| `wp/` | WordPress тема + PHP-файли (ACF blocks, GraphQL extensions, webhook) |
| `wp/plugins/racqueteer-demo-content/` | WP плагін з демо-контентом |

---

## 🗂️ ЩО ПОТРІБНО НАДАТИ КЛІЄНТУ

### 1. 🔑 Доступи (надає клієнт → тобі)

Клієнт повинен надати тобі:

| Що | Навіщо |
|----|--------|
| Доступ до WordPress hosting / cPanel / SSH | Завантажити тему та плагін |
| WordPress Admin логін + пароль | Встановити плагіни, налаштувати ACF |
| GitHub аккаунт клієнта (або email) | Надати доступ до репо |
| Vercel аккаунт клієнта (або email) | Деплой фронтенду |
| Домен (основний, наприклад `racqueteer.com.au`) | Підключити до Vercel та WP |

---

## 🏗️ КРОК ЗА КРОКОМ — ПЛАН ПЕРЕДАЧІ

---

### ФАЗА 1 — Git репозиторій

#### Ти робиш:
1. Переконайся що `.env.local` **НЕ є в репо** (є в `.gitignore`)
2. Переконайся що `wp/` папка також у репо (вона містить тему та плагін)
3. Запушити фінальну версію в GitHub

```bash
# З папки theme/racqueteer/
git add .
git commit -m "feat: final production build"
git push origin main
```

4. Запросити клієнта як collaborator у GitHub репо:
   - `Settings → Collaborators → Add people` → email клієнта
   - Або: створити окрему організацію для клієнта і перенести репо

#### Клієнт отримує:
- Доступ до GitHub репо (роль: Admin або Maintainer)
- URL репозиторію

---

### ФАЗА 2 — WordPress (хостинг клієнта)

#### 2.1 Встановити обов'язкові плагіни

Клієнту потрібно встановити (або ти встановлюєш через WP Admin):

| Плагін | Версія | Де взяти |
|--------|--------|----------|
| **WPGraphQL** | ≥ 1.28 | wordpress.org/plugins/wp-graphql |
| **WPGraphQL for ACF** | ≥ 2.6 | github.com/wp-graphql/wpgraphql-acf |
| **WPGraphQL Content Blocks** | ≥ 4.x | github.com/wpengine/wp-graphql-content-blocks |
| **Advanced Custom Fields PRO** | ≥ 6.x | acf.com (платна ліцензія) |

> ⚠️ **ACF PRO** — платний плагін. Клієнт повинен мати власну ліцензію або ти передаєш свою.

#### 2.2 Завантажити кастомну тему

Завантажити папку `wp/` як WordPress тему:

```
/wp-content/themes/racqueteer/    ← скопіювати всі файли з wp/ сюди
```

Активувати тему у WP Admin → Appearance → Themes → **Racqueteer**

#### 2.3 Завантажити демо-контент плагін (опціонально)

```
/wp-content/plugins/racqueteer-demo-content/   ← скопіювати з wp/plugins/
```

Активувати у WP Admin → Plugins.

#### 2.4 Налаштувати CORS для GraphQL

Файл `wp/inc/graphql-extensions.php` вже містить CORS `*`.  
Якщо потрібно обмежити — змінити `*` на домен Vercel.

#### 2.5 Перевірити GraphQL endpoint

Після активації WPGraphQL відкрити:
```
https://[wp-domain]/graphql
```
Мав з'явитись GraphQL Playground або відповідь на POST запит.

---

### ФАЗА 3 — Vercel деплой

#### 3.1 Підготувати змінні середовища

Створити файл `.env.local` **локально** (не комітити в git!):

```env
# URL до GraphQL ендпоінту WordPress
NEXT_PUBLIC_WP_GRAPHQL_URL=https://[wp-domain]/graphql

# URL до WP REST API
NEXT_PUBLIC_WP_REST_URL=https://[wp-domain]/wp-json

# Секрет для ISR ревалідації (генерувати випадково)
REVALIDATE_SECRET=your-random-secret-here-32chars
```

#### 3.2 Деплой на Vercel

**Варіант A — Через Vercel Dashboard (рекомендовано):**

1. Зайти на [vercel.com](https://vercel.com) → аккаунт клієнта
2. **Add New Project** → Import from GitHub
3. Вибрати репо → вибрати папку `theme/racqueteer` як **Root Directory**
4. **Environment Variables** — додати всі 3 змінні з `.env.local`
5. **Build Command:** `pnpm build` (або `npm run build`)
6. **Install Command:** `pnpm install`
7. **Output Directory:** `.next` (за замовчуванням)
8. Натиснути **Deploy**

**Варіант B — Через Vercel CLI:**

```bash
cd theme/racqueteer
npm i -g vercel
vercel login
vercel --prod
```

#### 3.3 Після деплою

Виконати:
```bash
vercel env add NEXT_PUBLIC_WP_GRAPHQL_URL production
vercel env add NEXT_PUBLIC_WP_REST_URL production
vercel env add REVALIDATE_SECRET production
```

Або через Dashboard → Settings → Environment Variables.

---

### ФАЗА 4 — Зв'язати WordPress і Vercel

#### 4.1 Оновити `next.config.mjs`

Якщо домен WP змінився — оновити:

```js
// theme/racqueteer/next.config.mjs
remotePatterns: [
  {
    protocol: 'https',
    hostname: '[новий-wp-домен]',   // ← змінити
    pathname: '/wp-content/uploads/**',
  },
  {
    protocol: 'https',
    hostname: '[vercel-домен.vercel.app]',  // ← або клієнтський домен
    pathname: '/**',
  },
],
```

Запушити зміни → Vercel автоматично перебудує.

#### 4.2 Налаштувати WP Admin → Racqueteer Settings

У WP Admin перейти: **Settings → Racqueteer**

| Поле | Значення |
|------|----------|
| **Next.js URL** | `https://[vercel-url].vercel.app` або клієнтський домен |
| **Revalidate Secret** | той самий рядок що в `REVALIDATE_SECRET` в Vercel |

Це потрібно щоб WordPress автоматично оновлював сторінки на Vercel при зміні контенту.

---

### ФАЗА 5 — Перевірка та тестування

#### Чеклист перед передачею:

```
[ ] WP GraphQL endpoint відповідає: https://[domain]/graphql
[ ] GraphQL запит повертає дані (перевірити GET_SITE_OPTIONS)
[ ] Фронтенд деплоєний на Vercel без помилок
[ ] Всі сторінки відкриваються: / , /about, /memberships, /private-events, /careers
[ ] Зображення завантажуються з WP
[ ] "Revalidate All Pages" в WP Admin → оновлює сторінки на Vercel
[ ] Webhook ISR: зміна запису в WP → сторінка оновлюється на Vercel автоматично
[ ] next.config.mjs містить правильний hostname для WP домену
```

---

## 🔐 СЕКРЕТИ — ЯК ГЕНЕРУВАТИ

```bash
# В терміналі (Linux/Mac/WSL):
openssl rand -hex 32

# Або в Node.js:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Результат (приклад): `a3f8d2c1b9e4f7a0d5c2b6e1f3a8d9c4b7e2f5a1d8c3b6e9f2a5d0c7b4e8f1a3`

---

## 📋 ЗМІННІ СЕРЕДОВИЩА — ПОВНИЙ СПИСОК

| Змінна | Тип | Приклад | Обов'язкова |
|--------|-----|---------|-------------|
| `NEXT_PUBLIC_WP_GRAPHQL_URL` | public | `https://racqueteer.com/graphql` | ✅ ТАК |
| `NEXT_PUBLIC_WP_REST_URL` | public | `https://racqueteer.com/wp-json` | ✅ ТАК |
| `REVALIDATE_SECRET` | private | `a3f8d2c1...` (32+ chars) | ✅ ТАК |

> `NEXT_PUBLIC_*` — доступні в браузері (вшиваються в JS bundle при білді)  
> `REVALIDATE_SECRET` — тільки на сервері, захищає `/api/revalidate` endpoint

---

## 🗒️ КЛІЄНТУ ПОТРІБНО МАТИ / ЗНАТИ

### Технічні вимоги до WP хостингу:
- PHP 8.0+
- WordPress 6.0+
- HTTPS (SSL сертифікат)
- Можливість встановлювати плагіни

### Ліцензії, які потрібні клієнту:
- **ACF PRO** — ліцензія від `advancedcustomfields.com` (~$49/рік)
- **Vercel** — Free plan достатньо для початку (Pro якщо потрібен higher bandwidth)

---

## 🔄 ПІСЛЯ ПЕРЕДАЧІ — УПРАВЛІННЯ КОНТЕНТОМ

Клієнт редагує контент через **WordPress Admin**:

| Що редагувати | Де в WP Admin |
|---------------|---------------|
| Тексти/зображення на сторінках | Pages → Edit (Gutenberg блоки) |
| Вакансії | Jobs → Add New |
| Відгуки | Testimonials → Add New |
| Локації | Locations → Add New |
| Членства (тарифи) | Memberships → Add New |
| Програми | Programs → Add New |
| Navbar / Footer | Settings → Site Settings → Navbar / Footer |
| Book Modal | Settings → Site Settings → Book Modal |

**Після кожної зміни** сторінка автоматично оновлюється на Vercel (через ISR webhook).  
Якщо не оновилась — натиснути **"Revalidate All Pages"** у Settings → Racqueteer.

---

## ⚠️ ВАЖЛИВО — МОЖЛИВІ ПРОБЛЕМИ

| Проблема | Рішення |
|---------|---------|
| Сторінка не оновлюється після зміни в WP | Settings → Racqueteer → "Revalidate All Pages" |
| GraphQL повертає помилку після додавання нових ACF полів | Settings → Racqueteer → "Flush WPGraphQL Schema Cache" → Revalidate All |
| Зображення не завантажуються | Перевірити hostname в `next.config.mjs` |
| Build помилка на Vercel | Перевірити чи правильно вказані Environment Variables |
| Blank page / 404 | Перевірити WP: чи сторінка опублікована (не Draft) |

---

## 📁 СТРУКТУРА ФАЙЛІВ ДЛЯ КЛІЄНТА

```
GitHub репо:
├── theme/racqueteer/          ← Next.js (деплоїться на Vercel)
│   ├── app/                   ← сторінки
│   ├── components/            ← UI компоненти
│   ├── lib/wp-api.ts          ← підключення до WP
│   └── wp/                    ← WP тема + PHP
│       ├── style.css          ← головний файл теми
│       ├── functions.php
│       ├── inc/               ← PHP інклюди (GraphQL, CPT, ACF)
│       └── plugins/           ← демо-контент плагін
```

---

*Підготовлено: GitHub Copilot AI Assistant*

