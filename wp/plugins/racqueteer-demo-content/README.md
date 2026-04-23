# Racqueteer Demo Content Importer

WordPress plugin для автоматичного створення демонстраційного контенту в WordPress для Racqueteer headless сайту.

## Що створює плагін

### Сторінки (5) із ACF Blocks
| Сторінка | Slug | Блоки |
|---|---|---|
| Home | `/` | hero, about, locations, programs, subscriptions, testimonials, events |
| Memberships | `/memberships` | membership-hero, subscriptions-detail, price-compare |
| Private Events | `/private-events` | private-events-hero, gallery, logo-marquee |
| About | `/about` | about-hero, mission, locations, contact |
| Careers | `/careers` | careers-hero, job-listings, career-contact |

### Custom Post Types
| CPT | Кількість |
|---|---|
| Jobs (вакансії) | 8 |
| Testimonials (відгуки) | 6 |
| Locations (локації) | 2 |
| Programs (програми) | 4 |
| Membership Plans | 4 |

### ACF Options
- **Navbar**: логотип, посилання, CTA кнопка
- **Footer**: логотип, email, phone, меню, локації, copyright

### Медіафайли
Плагін автоматично завантажує зображення з Next.js деплою в WP Media Library:
- `logo2.svg`, `logo-icon.png`
- `racket-pickleball.png`, `racket-padel.png`, `rackets-mobile.png`
- `membership-bg.png`, `about-hero.png`, `contact-bg.png`
- `logo1.svg` … `logo8.svg` (для Logo Marquee блока)

## Установка та використання

### 1. Передумови
Перед запуском імпорту переконайтеся, що встановлено і активовано:
- ✅ **Advanced Custom Fields PRO**
- ✅ **WPGraphQL**
- ✅ **WPGraphQL for ACF**
- ✅ **Racqueteer** тема активована

### 2. Завантажити плагін
```
Завантажити папку: racqueteer-demo-content/
          До:     wp-content/plugins/racqueteer-demo-content/
```

### 3. Активувати
**WP Admin → Plugins → Activate "Racqueteer Demo Content Importer"**

### 4. Налаштувати Next.js URL
**WP Admin → Settings → Racqueteer**
```
Next.js URL: https://racqueteer.vercel.app
```
> Це потрібно для автоматичного завантаження зображень і відео з публічної папки Next.js.

### 5. Запустити імпорт
**WP Admin → Tools → 🎾 Racqueteer Import → кнопка "Import Demo Content"**

Плагін виведе детальний лог: що створено, що пропущено, помилки.

## Ідемпотентність

Плагін **безпечно запускати повторно** — він не дублює контент, а оновлює існуючий:
- Сторінки шукаються за slug, якщо є — оновлюються
- CPT пости шукаються за title
- Медіафайли кешуються по URL (не завантажуються двічі)
- ACF Options перезаписуються

## Після імпорту

1. Перейти в **WP Admin → Pages** — перевірити 5 сторінок
2. Відкрити кожну сторінку в Gutenberg — переконатися, що блоки відображаються з даними
3. Перейти в **WP Admin → Site Settings → Navbar** — перевірити посилання
4. Перейти в **WP Admin → Site Settings → Footer** — перевірити дані
5. Відкрити `https://racqueteer.vercel.app` — сайт має показувати WP контент
6. Зробити `git push` якщо є зміни в коді (Vercel задеплоїть автоматично)

## Деактивація

Після успішного імпорту плагін можна **деактивувати** (контент залишиться).
Якщо потрібно прибрати все — видалити плагін (але це НЕ видаляє створений контент).

## Структура файлів

```
wp/plugins/racqueteer-demo-content/
  ├── racqueteer-demo-content.php   ← головний файл плагіну
  └── README.md                     ← цей файл
```

