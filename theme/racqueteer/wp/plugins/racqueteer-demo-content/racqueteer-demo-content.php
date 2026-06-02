<?php
/**
 * Plugin Name: Racqueteer Demo Content Importer (stub)
 * Description: ⚠️ Функціонал перенесено в тему. Цей плагін більше не потрібен. Див. wp/inc/demo-content.php
 * Version:     2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'admin_notices', function () {
    $screen = get_current_screen();
    if ( ! $screen || $screen->id !== 'plugins' ) {
        return;
    }
    echo '<div class="notice notice-warning"><p>';
    echo '🎾 <strong>Racqueteer Demo Content Importer</strong>: функціонал перенесено до теми (<code>wp/inc/demo-content.php</code>). ';
    echo 'Цей плагін можна деактивувати. ';
    echo '<a href="' . esc_url( admin_url( 'tools.php?page=rq-demo-import' ) ) . '">Відкрити імпортер →</a>';
    echo '</p></div>';
} );
