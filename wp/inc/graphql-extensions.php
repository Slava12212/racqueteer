<?php
/**
 * GraphQL Extensions
 * Хуки WPGraphQL для розширення схеми — Racqueteer headless theme.
 */

// ── CORS ─────────────────────────────────────────────────────────────────────
add_action( 'graphql_response_headers_to_send', function ( array $headers ): array {
    $headers['Access-Control-Allow-Origin']  = '*';
    $headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS';
    $headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    return $headers;
} );

// Preflight OPTIONS
add_action( 'init', function () {
    if ( isset( $_SERVER['REQUEST_METHOD'] ) && $_SERVER['REQUEST_METHOD'] === 'OPTIONS'
         && ! empty( $_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD'] ) ) {
        header( 'Access-Control-Allow-Origin: *' );
        header( 'Access-Control-Allow-Methods: POST, GET, OPTIONS' );
        header( 'Access-Control-Allow-Headers: Content-Type, Authorization' );
        header( 'Access-Control-Max-Age: 86400' );
        status_header( 200 );
        exit;
    }
} );

// ── Перевірка обов'язкових плагінів ──────────────────────────────────────────
add_action( 'init', function () {
    if ( ! function_exists( 'register_graphql_field' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>Racqueteer Theme:</strong> WPGraphQL plugin is required.</p></div>';
        } );
    }
    if ( ! class_exists( 'ACF' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>Racqueteer Theme:</strong> Advanced Custom Fields PRO is required.</p></div>';
        } );
    }
} );

// ── WPGraphQL: виправлення глибини запиту (для вкладених блоків) ──────────────
add_filter( 'graphql_query_max_depth', function () {
    return 20; // default=10, збільшуємо для nested blocks
} );

// ── WPGraphQL: реєстрація Racqueteer типів та полів ──────────────────────────
add_action( 'graphql_register_types', function () {

    // ── Enum: Location Status ────────────────────────────────────────────────
    register_graphql_enum_type( 'LocationStatus', [
        'description' => 'Status of a Racqueteer location',
        'values'      => [
            'available'   => [ 'value' => 'available' ],
            'coming_soon' => [ 'value' => 'coming_soon' ],
        ],
    ] );

} );

// ── WPGraphQL: ACF Options Pages manual fallback ──────────────────────────────
// If WPGraphQL for ACF does NOT auto-register acfOptionsNavbar / acfOptionsFooter
// (e.g. older plugin version or missing show_in_graphql on parent), we register them
// manually here so the Next.js frontend always has a working query target.
add_action( 'graphql_register_types', function () {
    if ( ! function_exists( 'register_graphql_field' )
        || ! function_exists( 'register_graphql_object_type' )
        || ! function_exists( 'get_field' ) ) {
        return;
    }

    // ── NavLink sub-type ─────────────────────────────────────────────────────
    if ( ! \WPGraphQL::get_type_registry()->get_registered_type( 'RqNavLink' ) ) {
        register_graphql_object_type( 'RqNavLink', [
            'description' => 'Navigation link item',
            'fields' => [
                'label' => [ 'type' => 'String' ],
                'url'   => [ 'type' => 'String' ],
            ],
        ] );
    }

    // ── RqImageRef sub-type ──────────────────────────────────────────────────
    if ( ! \WPGraphQL::get_type_registry()->get_registered_type( 'RqImageRef' ) ) {
        register_graphql_object_type( 'RqImageRef', [
            'description' => 'Image with URL and alt text',
            'fields' => [
                'sourceUrl' => [ 'type' => 'String' ],
                'altText'   => [ 'type' => 'String' ],
            ],
        ] );
    }

    // ── RqFooterLocation sub-type ────────────────────────────────────────────
    if ( ! \WPGraphQL::get_type_registry()->get_registered_type( 'RqFooterLocation' ) ) {
        register_graphql_object_type( 'RqFooterLocation', [
            'description' => 'Footer location item',
            'fields' => [
                'name'    => [ 'type' => 'String' ],
                'address' => [ 'type' => 'String' ],
            ],
        ] );
    }

    // ── Navbar Options type ──────────────────────────────────────────────────
    if ( ! \WPGraphQL::get_type_registry()->get_registered_type( 'RqNavbarFields' ) ) {
        register_graphql_object_type( 'RqNavbarFields', [
            'description' => 'ACF Navbar options fields',
            'fields' => [
                'navLogo'     => [ 'type' => 'RqImageRef' ],
                'navLogoIcon' => [ 'type' => 'RqImageRef' ],
                'navLinks'    => [ 'type' => [ 'list_of' => 'RqNavLink' ] ],
                'navCtaText'  => [ 'type' => 'String' ],
                'navCtaUrl'   => [ 'type' => 'String' ],
            ],
        ] );
    }

    if ( ! \WPGraphQL::get_type_registry()->get_registered_type( 'RqNavbarWrapper' ) ) {
        register_graphql_object_type( 'RqNavbarWrapper', [
            'description' => 'Wrapper for acfOptionsNavbar root field',
            'fields' => [
                'navbar' => [
                    'type'    => 'RqNavbarFields',
                    'resolve' => function () {
                        if ( ! function_exists( 'get_field' ) ) return null;
                        $logo_field = get_field( 'field_nav_logo', 'options' );
                        $icon_field = get_field( 'field_nav_logo_icon', 'options' );
                        $nav_links  = get_field( 'field_nav_links', 'options' ) ?: [];
                        return [
                            'navLogo'     => $logo_field
                                ? [ 'sourceUrl' => $logo_field['url'] ?? '', 'altText' => $logo_field['alt'] ?? '' ]
                                : null,
                            'navLogoIcon' => $icon_field
                                ? [ 'sourceUrl' => $icon_field['url'] ?? '', 'altText' => $icon_field['alt'] ?? '' ]
                                : null,
                            'navLinks'    => array_map( fn( $l ) => [
                                'label' => $l['label'] ?? '',
                                'url'   => $l['url'] ?? '',
                            ], $nav_links ),
                            'navCtaText'  => get_field( 'field_nav_cta_text', 'options' ) ?: '',
                            'navCtaUrl'   => get_field( 'field_nav_cta_url',  'options' ) ?: '',
                        ];
                    },
                ],
            ],
        ] );
    }

    // ── Footer Options type ──────────────────────────────────────────────────
    if ( ! \WPGraphQL::get_type_registry()->get_registered_type( 'RqFooterFields' ) ) {
        register_graphql_object_type( 'RqFooterFields', [
            'description' => 'ACF Footer options fields',
            'fields' => [
                'footerLogo'       => [ 'type' => 'RqImageRef' ],
                'footerEmail'      => [ 'type' => 'String' ],
                'footerPhone'      => [ 'type' => 'String' ],
                'footerCtaText'    => [ 'type' => 'String' ],
                'footerCtaUrl'     => [ 'type' => 'String' ],
                'footerMenuLinks'  => [ 'type' => [ 'list_of' => 'RqNavLink' ] ],
                'footerLocations'  => [ 'type' => [ 'list_of' => 'RqFooterLocation' ] ],
                'footerCopyright'  => [ 'type' => 'String' ],
                'footerLegalLinks' => [ 'type' => [ 'list_of' => 'RqNavLink' ] ],
            ],
        ] );
    }

    if ( ! \WPGraphQL::get_type_registry()->get_registered_type( 'RqFooterWrapper' ) ) {
        register_graphql_object_type( 'RqFooterWrapper', [
            'description' => 'Wrapper for acfOptionsFooter root field',
            'fields' => [
                'footer' => [
                    'type'    => 'RqFooterFields',
                    'resolve' => function () {
                        if ( ! function_exists( 'get_field' ) ) return null;
                        $logo        = get_field( 'field_footer_logo',         'options' );
                        $menu_links  = get_field( 'field_footer_menu_links',   'options' ) ?: [];
                        $locations   = get_field( 'field_footer_locations',    'options' ) ?: [];
                        $legal_links = get_field( 'field_footer_legal_links',  'options' ) ?: [];
                        return [
                            'footerLogo'       => $logo
                                ? [ 'sourceUrl' => $logo['url'] ?? '', 'altText' => $logo['alt'] ?? '' ]
                                : null,
                            'footerEmail'      => get_field( 'field_footer_email',     'options' ) ?: '',
                            'footerPhone'      => get_field( 'field_footer_phone',     'options' ) ?: '',
                            'footerCtaText'    => get_field( 'field_footer_cta_text',  'options' ) ?: '',
                            'footerCtaUrl'     => get_field( 'field_footer_cta_url',   'options' ) ?: '',
                            'footerMenuLinks'  => array_map( fn( $l ) => [
                                'label' => $l['label'] ?? '',
                                'url'   => $l['url']   ?? '',
                            ], $menu_links ),
                            'footerLocations'  => array_map( fn( $l ) => [
                                'name'    => $l['name']    ?? '',
                                'address' => $l['address'] ?? '',
                            ], $locations ),
                            'footerCopyright'  => get_field( 'field_footer_copyright', 'options' ) ?: '',
                            'footerLegalLinks' => array_map( fn( $l ) => [
                                'label' => $l['label'] ?? '',
                                'url'   => $l['url']   ?? '',
                            ], $legal_links ),
                        ];
                    },
                ],
            ],
        ] );
    }

    // ── Register acfOptionsNavbar / acfOptionsFooter on RootQuery ────────────
    // These are fallback registrations: if WPGraphQL for ACF already registered them
    // (via show_in_graphql on the options sub-page), these calls are no-ops because
    // register_graphql_field does not overwrite existing fields.
    register_graphql_field( 'RootQuery', 'acfOptionsNavbar', [
        'type'        => 'RqNavbarWrapper',
        'description' => 'ACF Navbar options (from Site Settings → Navbar)',
        'resolve'     => fn() => [], // actual resolve is in the wrapper type above
    ] );

    register_graphql_field( 'RootQuery', 'acfOptionsFooter', [
        'type'        => 'RqFooterWrapper',
        'description' => 'ACF Footer options (from Site Settings → Footer)',
        'resolve'     => fn() => [],
    ] );

}, 99 ); // priority 99 = after WPGraphQL for ACF auto-registration (priority 10)

// ── WPGraphQL: Content Blocks — дозвіл на null attributes ────────────────────
// WPGraphQL Content Blocks може повернути null для невідомих inline fragment fields.
// Це нормально — BlockRenderer просто ігнорує null.
add_filter( 'graphql_connection_query_args', function ( array $args ): array {
    // Дозволяємо більшу кількість елементів у CPT запитах
    if ( isset( $args['number'] ) && $args['number'] < 100 ) {
        // only bump if explicitly capped below our needs
    }
    return $args;
} );
