# Location Status & Amenities — Хронологія проблеми та рішення

## Коротко

**Проблема**: GraphQL-запити до `locations` повертали «Internal server error».  
**Причина**: WPGraphQL for ACF v2.6.x зберігає ACF `select`-поля в серіалізованому вигляді (`['available']` — PHP-масив), не рядком. PHP 8.x кидає `TypeError` під час спроби перетворити масив на рядок.  
**Рішення**: повністю вилучити `select`-поля з автоматичної генерації WPGraphQL for ACF; зареєструвати `locationStatus` та `locationAmenities` ВРУЧНУ з власними резолверами через `get_field()`.

---

## Хронологія

### До проблеми (v20 і раніше)

- Locations-запит **працював**, але повертав `status: "Array"` — PHP-масив `['available']` PHP 7.x перетворював на рядок «Array» без винятку, помилка тихо проковтувалась.
- `amenities` у locationFields не мав sub-fields з `show_in_graphql => true`, тому WPGraphQL for ACF повертав `[]` для `amenities { icon label }` без помилки.

---

### v21 — введення `show_in_graphql` на sub-fields amenities → ❌ Internal server error

**Що зробили**: додали `show_in_graphql => true` до полів `icon` (select) і `label` (text) усередині repeater `amenities` в `acf-blocks.php`.

**Що сталось**: WPGraphQL for ACF v2.6.x намагається автоматично згенерувати GraphQL-тип для `icon` select sub-field. Під час генерації або резолвінгу PHP-масив `['courts']` потрапляє у graphql-php для серіалізації як `String` → `TypeError` у PHP 8.x → **Internal server error** для всього запиту locations.

**Спроба виправити**:
- Додано `acf/format_value/key=field_loc_status` (priority 20) — не допомогло: WPGraphQL for ACF обходить ACF format_value для select-полів через власний data-loader.
- Додано `graphql_resolve_field` фільтр — не допомогло: PHP 8.x кидає `TypeError` **всередині** резолвера ACF до того, як фільтр встигає перехопити результат.

---

### v22 — `locationAmenities` як окреме поле на `Location` → ✅ Amenities OK, ❌ Status ще не виправлено

**Що зробили**:
- Забрали `show_in_graphql` з `amenities` repeater і sub-fields у `acf-blocks.php`.
- Зареєстрували вручну `LocationAmenityItem { icon: String, label: String }` та поле `Location.locationAmenities: [LocationAmenityItem]` з резолвером через `get_field('amenities', $post_id)`.
- Оновили запит `GET_LOCATIONS`: `locationAmenities { icon label }` — тепер на рівні `Location`, а не всередині `locationFields`.

**Результат**: amenities тепер повертаються коректно. Але `locationFields.status` досі повертає «Internal server error» — попередня `show_in_graphql` ситуація для `status` (select) не змінилась.

---

### v23 — `get_post_metadata` перехоплення → ❌ Все одно не працювало

**Що зробили**: додали `add_filter('get_post_metadata', ..., 0)` — перехоплення на рівні WordPress metadata API з прямим `$wpdb` SQL-запитом для уникнення рекурсії.

**Чому не допомогло**: WPGraphQL for ACF v2.6.x для `select`-полів у field groups **не використовує** стандартний WordPress `get_post_meta()`. Він застосовує власний ACF data-loader, який читає дані в обхід стандартних WordPress-хуків. Тому фільтр `get_post_metadata` ніколи не спрацьовував для цього поля.

---

### v24 — `locationStatus: String` на `Location` → ✅ Повне виправлення

**Що зробили** (остаточне рішення):

#### `wp/inc/acf-blocks.php`
- Додано `'show_in_graphql' => false` до поля `status` (select) — повністю вимикає авто-генерацію типу WPGraphQL for ACF для цього поля.
- Amenities repeater та sub-fields вже мали `show_in_graphql` вимкненим з v22.

#### `wp/inc/graphql-extensions.php` (v24)
```php
add_action('graphql_register_types', function () {

    // Location status — власний резолвер, обходить WPGraphQL for ACF select
    register_graphql_field('Location', 'locationStatus', [
        'type'    => 'String',
        'resolve' => function ($post) {
            $val = get_field('field_loc_status', $post->databaseId);
            if (is_array($val)) { $val = $val[0] ?? ''; }
            return strtolower(trim((string)$val)) ?: 'available';
        },
    ]);

    // Amenities type + field (з v22, незмінено)
    register_graphql_object_type('LocationAmenityItem', [...]);
    register_graphql_field('Location', 'locationAmenities', [
        'type'    => ['list_of' => 'LocationAmenityItem'],
        'resolve' => function ($post) {
            $rows = get_field('amenities', $post->databaseId);
            // normalize + return
        },
    ]);

}, 5);
```

`get_field()` використовує ACF-форматування (format_value), яке коректно повертає рядок з select-поля. Навіть якщо raw-мета є масивом, резолвер нормалізує його на місці.

#### `lib/graphql/queries.ts`
```graphql
query GetLocations {
  locations(first: 100) {
    nodes {
      databaseId
      locationStatus          # String, пряме поле на Location
      locationAmenities { icon label }   # [LocationAmenityItem]
      locationFields {
        locationId
        name
        address
        description
        image { node { sourceUrl } }
        # status — ВИДАЛЕНО з locationFields (show_in_graphql=false)
      }
    }
  }
}
```

#### `lib/wp-api.ts`
```typescript
const rawSt = node.locationStatus ?? '';
const status: 'available' | 'coming_soon' =
  rawSt === 'coming_soon' ? 'coming_soon' : 'available';
```

---

## Ключовий висновок — WPGraphQL for ACF v2.6.x і select-поля

WPGraphQL for ACF v2.6.x **не використовує** стандартні WordPress-хуки для читання значень ACF `select`-полів. Натомість він читає raw post_meta через власний data-loader, обходячи:
- `acf/format_value` (ACF hook)
- `get_post_metadata` (WordPress hook)
- `graphql_resolve_field` (WPGraphQL hook, спрацьовує після resolver; якщо resolver кинув `TypeError` в PHP 8.x — фільтр не виконується)

**Правило для цього проекту**: будь-яке ACF `select`-поле, яке потрібно в GraphQL, **реєструй вручну** через `register_graphql_field()` з резолвером через `get_field()`.

---

## Фінальна GraphQL-структура локацій

```
Location {
  databaseId            ← WPGraphQL built-in
  locationStatus        ← String, manual resolver (get_field 'status')
  locationAmenities     ← [LocationAmenityItem], manual resolver  
  locationFields {
    locationId, name, address, description, image
    # status — ПРИХОВАНИЙ (show_in_graphql=false)
  }
}
```

---

## Файли змінені в процесі

| Файл | Зміна |
|------|-------|
| `wp/inc/acf-blocks.php` | `show_in_graphql=false` для `status` та amenities sub-fields |
| `wp/inc/graphql-extensions.php` | Manual `locationStatus` + `locationAmenities` resolver (v24) |
| `lib/graphql/queries.ts` | `locationStatus` + `locationAmenities` на рівні `Location` node |
| `lib/wp-api.ts` | Читання `node.locationStatus` замість `lf.status` |
| `wp/inc/demo-content.php` | Verification query оновлено |

