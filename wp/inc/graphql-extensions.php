<?php
/**
 * GraphQL Extensions
 * Додаткові налаштування WPGraphQL для розширення схеми.
 */
// Підключення WPGraphQL for ACF (якщо не активовано автоматично)
add_action( 'graphql_register_types', function () {
    // Реєстрація CPT ACF полів для Jobs
    register_graphql_field( 'Job', 'acf', [
        'type'        => 'JobAcf',
        'description' => 'ACF fields for job',
    ] );
} );
// Переконатися що WPGraphQL доступний
add_action( 'init', function () {
    if ( ! function_exists( 'register_graphql_field' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>Racqueteer Theme:</strong> WPGraphQL plugin is required. Please install and activate it.</p></div>';
        } );
    }
    if ( ! class_exists( 'ACF' ) ) {
        add_action( 'admin_notices', function () {
            echo '<div class="notice notice-error"><p><strong>Racqueteer Theme:</strong> Advanced Custom Fields PRO is required.</p></div>';
        } );
    }
} );
