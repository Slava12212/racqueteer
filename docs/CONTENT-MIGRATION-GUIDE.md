# Setup & Import Guide — Racqueteer Theme

> **Мета:** Встановити тему Racqueteer на WordPress, запустити Demo Import, і отримати повноцінно налаштований сайт зі всім контентом, структурою та медіа-файлами.

---

## Що робить Demo Import

Один клік — і автоматично створюється:

| Що | Деталі |
|----|--------|
| ⚙️ WordPress settings | Permalinks → `/%postname%/`, Timezone → Sydney, коментарі вимкнено |
| ⚙️ WPGraphQL settings | Public introspection ON, batch queries ON |
| 📄 Сторінки (5) | Home, Memberships, Private Events, About, Careers — з усіма ACF блоками і контентом |
| 💼 Вакансії (8 CPT) | Assistant Manager, Head Pickleball Coach, Padel Trainer, Youth Program Coach, Lead Barista, Barista, Front Desk Associate, Club Manager |
| 💬 Відгуки (6 CPT) | Martin Goutry, Sarah Chen, James Okafor, Emily Rodriguez, Lisa Park, Tom Walker |
| 📍 Локації (3 CPT) | Alexandria Club (coming soon), Rosehill Club (coming soon), Homebush Club (available) |
| 🏟️ Amenities (6 CPT) | Courts, Locker Rooms, Members Lounge, Café, Coworking, Pro Shop |
| 🎾 Програми (5 CPT) | Women's Intermediate, Pickleball Social, Pickleball 101, Padel 101, Padel Americano |
| 💳 Membership Plans (4 CPT) | Starter $89, Light $135, Pro $189, Pro+ $397 |
| 🖼️ Медіа | Всі зображення з `wp/assets/images/` (amenities, rackets, logos, book modal тощо) |
| 🧭 Navbar / Footer | Структура, меню, CTA, контакти |
| 🎫 Book Modal | Структура для Padel та Pickleball |

---

## Передумови (що має бути встановлено)

Перед запуском імпорту — переконайтесь що встановлено і активовано:

| Плагін | Де взяти | Ціна |
|--------|----------|------|
| **Advanced Custom Fields PRO** | acf.com | ~$49/рік |
| **WPGraphQL** | wordpress.org | Безкоштовно |
| **WPGraphQL for ACF** | wpgraphql.com | Безкоштовно |
| **WPGraphQL Content Blocks** | wordpress.org | Безкоштовно |

> ⚠️ Без ACF PRO та WPGraphQL імпорт запуститься, але ACF-поля не збережуться.

---

## Кроки встановлення

### Крок 1 — Встановити плагіни

1. WP Admin → **Plugins → Add New**
2. Встановити і активувати всі 4 плагіни зі списку вище
3. Переконатись що всі 4 показують "Active"

---

### Крок 2 — Встановити тему Racqueteer

1. WP Admin → **Appearance → Themes → Add New → Upload Theme**
2. Завантажити архів теми `racqueteer.zip`
3. Натиснути **Activate**

> Після активації в меню WP Admin з'явиться пункт **Tools → 🎾 Racqueteer Import**

---

### Крок 3 — Запустити Demo Import

1. WP Admin → **Tools → 🎾 Racqueteer Import**
2. На сторінці буде чекліст — переконайтесь що всі 4 пункти зелені ✅
3. Натиснути **🚀 Import Demo Content**
4. Дочекатись зеленого блоку з повідомленням **✅ Import completed!**

> Імпорт займає ~30–60 секунд залежно від швидкості сервера.

---

### Крок 4 — Перевірка

1. На тій же сторінці натиснути **🔍 Verify GraphQL**
2. Всі пункти мають бути ✅
3. Перейти за посиланнями що з'явились після імпорту — перевірити сторінки в Gutenberg

---

### Крок 5 — Після імпорту: що треба оновити вручну

Ці речі імпорт ставить як заготовки — потрібно замінити на реальні значення клієнта:

| Що | Де змінити | Що поставити |
|----|-----------|--------------|
| **Логотип** (Navbar) | Site Settings → Navbar → Nav Logo | Реальний логотип клієнта |
| **Логотип** (Footer) | Site Settings → Footer → Footer Logo | Реальний логотип |
| **Booking URL** (CTA кнопка) | Site Settings → Navbar → Nav CTA URL | Реальне посилання на бронювання |
| **Book Modal** URLs | Site Settings → Book Modal | Реальні посилання Padel / Pickleball |
| **Hero відео** | Pages → Home → Hero Block → Video | Реальне відео (або залишити demo) |
| **Careers відео** | Pages → Careers → Careers Hero → Video | Реальне відео |
| **Partner logos** | Pages → Private Events → Logo Marquee | Реальні лого партнерів |
| **Email / Phone** | Pages → About → Contact Block | Реальні контакти |
| **Footer email** | Site Settings → Footer | Реальний email |

---

## Чи зламає старий контент WP новий імпорт?

**Коротка відповідь: ні.** Але є нюанси:

### ✅ Що НЕ торкається старого контенту

- Існуючі пости, сторінки (якщо у них немає slug `home`, `memberships`, `private-events`, `about`, `careers`)
- Медіа-бібліотека (старі файли залишаються)
- Користувачі, ролі, коментарі
- Всі інші плагіни та їхні дані

### ⚠️ Потенційні конфлікти

| Ситуація | Що станеться | Вирішення |
|----------|-------------|-----------|
| Вже існує сторінка зі slug `home` / `memberships` / `private-events` / `about` / `careers` | Імпорт **перезапише** її контент (блоки) | Якщо стара сторінка важлива — перейменуй її slug перед імпортом |
| Вже існують CPT записи `job`, `testimonial`, `location` etc. з такими самими назвами | Записи **оновляться**, дублів не буде | Безпечно |
| ACF вже встановлено з кастомними полями | Наш імпорт додає поля до наших CPTs, не чіпаючи існуючі | Безпечно |
| Permalink structure вже не `/%postname%/` | Імпорт **автоматично змінить** на `/%postname%/` | Старі URL можуть змінитись — переконайся що це ок |

### 🔒 Рекомендація для чистого результату

Найкраще робити на **свіжому WP** (WordPress install без старого контенту) — тоді гарантовано жодних конфліктів.

Якщо встановлюєш на існуючий WP — перевір чи немає сторінок зі slugами `home`, `memberships`, `private-events`, `about`, `careers`. Якщо є — перейменуй їх перед імпортом.

---

## Медіа-файли: що і звідки

Всі зображення вже упаковані **в тему** (`wp/assets/images/`). Імпорт підхоплює їх локально — **інтернет-з'єднання для завантаження зображень не потрібно**.

| Файл | Використовується як |
|------|---------------------|
| `racket-pickleball.png` | About block — ліве зображення |
| `racket-padel.png` | About block — праве зображення |
| `about-hero.png` | Events, Mission, Careers contact |
| `amenity-courts-1/2.jpg` | Amenity: Корти |
| `amenity-lounge-1/2.jpg` | Amenity: Members Lounge |
| `amenity-locker-rooms.jpg` | Amenity: Locker Rooms |
| `amenity-cafe.jpg` | Amenity: Café |
| `amenity-coworking.jpg` | Amenity: Coworking |
| `amenity-pro-shop.jpg` | Amenity: Pro Shop |
| `book-modal-padel-v2.webp` | Book Modal — Padel |
| `book-modal-pickleball-v2.webp` | Book Modal — Pickleball |
| `logo2.svg` | Navbar / Footer логотип |
| `logo-icon.png` | Navbar іконка |
| `logo1–8.svg` | Private Events — Partner logos |

---

## Quick Reference після імпорту

| Що перевірити | Де |
|--------------|-----|
| GraphQL endpoint | `/graphql` (має повертати JSON) |
| GraphiQL IDE | `wp-admin/admin.php?page=graphiql-ide` |
| Site Settings → Navbar | `wp-admin/admin.php?page=navbar-options` |
| Site Settings → Book Modal | `wp-admin/admin.php?page=book-modal-options` |
| Verify GraphQL | Tools → 🎾 Racqueteer Import → **Verify GraphQL** |
