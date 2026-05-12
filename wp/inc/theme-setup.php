<?php
/**
 * Налаштування теми
 * Базова конфігурація WordPress теми.
 */

add_action( 'after_setup_theme', function () {
    // Увімкнути необхідні функції WordPress
    add_theme_support( 'post-thumbnails' );
    add_theme_support( 'title-tag' );
    add_theme_support( 'editor-styles' );

    // Блоковий редактор Gutenberg
    add_theme_support( 'align-wide' );
    add_theme_support( 'wp-block-styles' );

    // Вимкнути адмін-бар на фронтенді (headless — не потрібно)
    add_filter( 'show_admin_bar', '__return_false' );
} );

// Вимкнути невикористовувані скрипти/стилі фронтенду для headless-режиму
add_action( 'wp_enqueue_scripts', function () {
    wp_dequeue_style( 'wp-block-library' );
    wp_dequeue_style( 'wp-block-library-theme' );
    wp_dequeue_style( 'global-styles' );
}, 100 );

// Зареєструвати категорію блоків "Racqueteer"
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
// Пріоритет 5 — до того як ACF реєструє власні внутрішні хуки at priority 10
add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_options_page' ) ) {
        return;
    }

    // Батьківська ACF-сторінка — "Site Settings" у бічному меню
    // ВАЖЛИВО: show_in_graphql ПОВИНЕН бути TRUE на батьківській сторінці, щоб підсторінки були доступні у GraphQL.
    // WPGraphQL for ACF вимагає, щоб батьківська сторінка була у GraphQL для відображення підсторінок.
    acf_add_options_page( [
        'page_title'         => 'Site Settings',
        'menu_title'         => 'Site Settings',
        'menu_slug'          => 'racqueteer-site-settings',
        'capability'         => 'manage_options',
        'icon_url'           => 'dashicons-admin-settings',
        'position'           => 2,
        'redirect'           => true,
        'show_in_graphql'    => true,           // ← ОБОВ'ЯЗКОВО true, щоб підсторінки з'явились у GraphQL
        'graphql_field_name' => 'siteSettings', // → acfOptionsSiteSettings (батьківська, не запитується напряму)
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

    // Підсторінка Book Modal
    acf_add_options_sub_page( [
        'page_title'         => 'Book Modal Settings',
        'menu_title'         => 'Book Modal',
        'parent_slug'        => 'racqueteer-site-settings',
        'menu_slug'          => 'acf-options-book-modal',
        'capability'         => 'manage_options',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'bookModal', // → acfOptionsBookModal { bookModal { ... } }
    ] );
}, 5 );
