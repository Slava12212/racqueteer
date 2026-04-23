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
add_action( 'acf/init', function () {
    if ( ! function_exists( 'acf_add_options_page' ) ) {
        return;
    }

    // Головна сторінка налаштувань (вже є як Racqueteer Settings у плагіні)
    // Додаємо підсторінки Navbar і Footer
    acf_add_options_sub_page( [
        'page_title'  => 'Navbar Settings',
        'menu_title'  => 'Navbar',
        'parent_slug' => 'racqueteer-settings',
        'menu_slug'   => 'acf-options-navbar',
        'capability'  => 'manage_options',
    ] );

    acf_add_options_sub_page( [
        'page_title'  => 'Footer Settings',
        'menu_title'  => 'Footer',
        'parent_slug' => 'racqueteer-settings',
        'menu_slug'   => 'acf-options-footer',
        'capability'  => 'manage_options',
    ] );
} );
