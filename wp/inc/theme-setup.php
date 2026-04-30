<?php
/**
 * Theme Setup
 * Базові налаштування WordPress теми.
 */

add_action( 'after_setup_theme', function () {
    // Підтримка необхідних WordPress фіч
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'editor-styles' );

    // Gutenberg block editor
    add_theme_support( 'align-wide' );
    add_theme_support( 'wp-block-styles' );

    // Відключаємо frontend стилі WordPress (headless — не потрібно)
    add_filter( 'show_admin_bar', '__return_false' );
} );

// Відключаємо непотрібні frontend скрипти/стилі для headless
add_action( 'wp_enqueue_scripts', function () {
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'global-styles' );
}, 100 );

// Додати категорію блоків "Racqueteer"
add_filter( 'block_categories_all', function ( $categories ) {
    return array_merge(
        [
            [
                'slug'  => 'racqueteer',
                'title' => 'Racqueteer',
                'icon'  => 'shield',
            ],
        ],
        $categories
    );
} );

// ======================================================
// Phase 8 — ACF Options Pages (Navbar + Footer)
// ======================================================
// Must use priority 5 — before ACF registers its own internal hooks at 10
add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_options_page' ) ) {
        return;
    }

    // Головна ACF-сторінка — "Site Settings" у sidebar
    // IMPORTANT: show_in_graphql must be TRUE on parent so sub-pages are exposed in GraphQL.
    // WPGraphQL for ACF requires parent page to be in GraphQL for sub-pages to appear.
    acf_add_options_page( [
        'page_title'         => 'Site Settings',
        'menu_title'         => 'Site Settings',
        'menu_slug'          => 'racqueteer-site-settings',
        'capability'         => 'manage_options',
        'icon_url'           => 'dashicons-admin-settings',
        'position'           => 2,
        'redirect'           => true,
        'show_in_graphql'    => true,           // ← MUST be true for sub-pages to appear in GraphQL
        'graphql_field_name' => 'siteSettings', // → acfOptionsSiteSettings (parent, not queried directly)
    ] );

    // Підсторінка Navbar
    acf_add_options_sub_page( [
        'page_title'         => 'Navbar Settings',
        'menu_title'         => 'Navbar',
        'parent_slug'        => 'racqueteer-site-settings',
        'menu_slug'          => 'acf-options-navbar',
        'capability'         => 'manage_options',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'navbar',  // → acfOptionsNavbar { navbar { ... } }
    ] );

    // Підсторінка Footer
    acf_add_options_sub_page( [
        'page_title'         => 'Footer Settings',
        'menu_title'         => 'Footer',
        'parent_slug'        => 'racqueteer-site-settings',
        'menu_slug'          => 'acf-options-footer',
        'capability'         => 'manage_options',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'footer',  // → acfOptionsFooter { footer { ... } }
    ] );
}, 5 );
