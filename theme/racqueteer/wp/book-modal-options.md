# Book Modal — WordPress ACF Options Page Setup

This document describes the ACF configuration required so the "Book a Court"
pop-up modal can be managed from the WordPress admin panel.

---

## 1. Register the Options Page (PHP)

Add to your theme's `functions.php` (or a custom plugin):

```php
if ( function_exists( 'acf_add_options_page' ) ) {
    acf_add_options_page( [
        'page_title' => 'Book Modal',
        'menu_title' => 'Book Modal',
        'menu_slug'  => 'acf-options-book-modal',
        'capability' => 'edit_posts',
        'parent_slug' => 'options-general.php', // or '' for top-level
    ] );
}
```

The WPGraphQL query key is: `acfOptionsBookModal { bookModal { ... } }`.

---

## 2. ACF Field Group

Create a **Field Group** called **"Book Modal"** and attach it to the options
page created above (`menu_slug: acf-options-book-modal`).

| Field Label                | Field Name (slug)      | Type   | Notes                                  |
|----------------------------|------------------------|--------|----------------------------------------|
| Modal Title                | `modal_title`          | Text   | Default: "Book a Court"               |
| Modal Subtitle             | `modal_subtitle`       | Text   | Default: "Select your sport to get started" |
| **Sport 1 (Padel)**        |                        |        |                                        |
| Sport 1 Title              | `sport1_title`         | Text   | Default: "Padel"                      |
| Sport 1 Image              | `sport1_image`         | Image  | Return format: **Array**              |
| Sport 1 Button Text        | `sport1_button_text`   | Text   | Default: "Book a Court"               |
| Sport 1 Booking URL        | `sport1_booking_url`   | URL    | External booking link                 |
| **Sport 2 (Pickleball)**   |                        |        |                                        |
| Sport 2 Title              | `sport2_title`         | Text   | Default: "Pickleball"                 |
| Sport 2 Image              | `sport2_image`         | Image  | Return format: **Array**              |
| Sport 2 Button Text        | `sport2_button_text`   | Text   | Default: "Book a Court"               |
| Sport 2 Booking URL        | `sport2_booking_url`   | URL    | External booking link                 |

> **Important:** Set every Image field's "Return Format" to **Array** so that
> WPGraphQL can resolve the `sourceUrl` sub-field.

---

## 3. GraphQL Registration (PHP)

If WPGraphQL does not auto-expose the options page fields, register them
manually:

```php
add_action( 'graphql_register_types', function() {
    register_graphql_object_type( 'BookModalOptions', [
        'fields' => [
            'modalTitle'       => [ 'type' => 'String' ],
            'modalSubtitle'    => [ 'type' => 'String' ],
            'sport1Title'      => [ 'type' => 'String' ],
            'sport1Image'      => [ 'type' => 'MediaItem' ],
            'sport1ButtonText' => [ 'type' => 'String' ],
            'sport1BookingUrl' => [ 'type' => 'String' ],
            'sport2Title'      => [ 'type' => 'String' ],
            'sport2Image'      => [ 'type' => 'MediaItem' ],
            'sport2ButtonText' => [ 'type' => 'String' ],
            'sport2BookingUrl' => [ 'type' => 'String' ],
        ],
    ] );

    register_graphql_field( 'RootQuery', 'acfOptionsBookModal', [
        'type'    => 'AcfOptionsBookModal',
        'resolve' => fn() => get_fields( 'option' ),
    ] );
} );
```

---

## 4. Fallback Behaviour

When the WordPress options page is **not yet configured** (or GraphQL returns
`null`), the modal uses these hardcoded defaults defined in `BookModal.tsx`:

| Setting            | Fallback value                         | Source                      |
|--------------------|----------------------------------------|-----------------------------|
| Modal title        | "Book a court"                         | Hardcoded                   |
| Modal subtitle     | "Select your sport to get started"     | Hardcoded                   |
| Sport 1 title      | "Padel"                                | Hardcoded                   |
| Sport 1 image      | `/book-modal-padel-v2.webp`            | `public/`                   |
| Sport 1 button     | "Book a Court"                         | Hardcoded                   |
| Sport 1 URL        | `BOOKING_URL_PADEL` in `booking-urls.ts` | `lib/booking-urls.ts`     |
| Sport 2 title      | "Pickleball"                           | Hardcoded                   |
| Sport 2 image      | `/book-modal-pickleball-v2.webp`       | `public/`                   |
| Sport 2 button     | "Book a Court"                         | Hardcoded                   |
| Sport 2 URL        | `BOOKING_URL_PICKLEBALL` in `booking-urls.ts` | `lib/booking-urls.ts` |

---

## 5. Amenities Block — Icon Keys

The **AmenitiesBlock** maps a text key entered in the ACF `feature1Icon` /
`feature2Icon` field to an inline SVG.

Valid keys (case-insensitive):

| Key         | Icon shown               |
|-------------|--------------------------|
| `courts`    | Padel/Pickleball courts  |
| `jumprope`  | Jump-rope / fitness      |
| `locker`    | Locker room              |
| `sauna`     | Sauna / steam            |
| `lounge`    | Members lounge           |
| `member`    | Member / coaching        |
| `coffee`    | Café / coffee bar        |
| `drink`     | Bar / drinks             |
| `laptop`    | Coworking / laptop       |
| `video`     | Video / call booth       |
| `shop`      | Pro shop / retail        |

If the key is not recognised (or left blank), no icon is shown and only the
feature text appears.

