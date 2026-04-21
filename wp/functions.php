<?php
/**
 * Racqueteer WordPress Theme
 *
 * Headless WordPress theme for Racqueteer Pickleball & Padel Club.
 * Використовується в зв'язці з Next.js фронтендом через WPGraphQL.
 *
 * @package Racqueteer
 * @version 1.0.0
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

define( 'RACQUETEER_VERSION', '1.0.0' );
define( 'RACQUETEER_DIR', get_template_directory() );
define( 'RACQUETEER_URL', get_template_directory_uri() );

// ─── Завантаження модулів ────────────────────────────────────────────────────

require_once RACQUETEER_DIR . '/inc/theme-setup.php';
require_once RACQUETEER_DIR . '/inc/cpt-registration.php';
require_once RACQUETEER_DIR . '/inc/acf-blocks.php';
require_once RACQUETEER_DIR . '/inc/graphql-extensions.php';
require_once RACQUETEER_DIR . '/inc/revalidate-webhook.php';

