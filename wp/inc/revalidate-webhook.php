<?php
/**
 * ISR Revalidation Webhook (WordPress side)
 *
 * Реєструє REST endpoint /wp-json/racqueteer/v1/revalidate
 * який викликається при збереженні сторінки в WordPress.
 *
 * Альтернатива: використати плагін WP Webhooks замість цього коду.
 */
add_action( 'rest_api_init', function () {
    register_rest_route( 'racqueteer/v1', '/revalidate', [
        'methods'             => 'POST',
        'callback'            => 'racqueteer_trigger_revalidate',
        'permission_callback' => '__return_true',
    ] );
} );

function racqueteer_trigger_revalidate( WP_REST_Request $request ) {
    $secret = get_option( 'racqueteer_revalidate_secret', '' );
    if ( empty( $secret ) ) {
        return new WP_Error( 'no_secret', 'Revalidate secret not configured', [ 'status' => 500 ] );
    }
    $slug   = $request->get_param( 'slug' ) ?: '/';
    $nextjs = get_option( 'racqueteer_nextjs_url', 'https://racqueteer.com' );
    $url    = trailingslashit( $nextjs ) . 'api/revalidate?secret=' . rawurlencode( $secret );
    $response = wp_remote_post( $url, [
        'body'        => wp_json_encode( [ 'slug' => $slug ] ),
        'headers'     => [ 'Content-Type' => 'application/json' ],
        'timeout'     => 10,
    ] );
    if ( is_wp_error( $response ) ) {
        return new WP_Error( 'revalidate_failed', $response->get_error_message(), [ 'status' => 500 ] );
    }
    return rest_ensure_response( [ 'revalidated' => true, 'slug' => $slug ] );
}

/**
 * Допоміжна функція для надсилання revalidate запиту на Next.js.
 */
function racqueteer_send_revalidate( string $slug ): void {
    $secret = get_option( 'racqueteer_revalidate_secret', '' );
    $nextjs = get_option( 'racqueteer_nextjs_url', '' );
    if ( empty( $secret ) || empty( $nextjs ) ) {
        return;
    }
    $url = trailingslashit( $nextjs ) . 'api/revalidate?secret=' . rawurlencode( $secret );
    wp_remote_post( $url, [
        'body'     => wp_json_encode( [ 'slug' => $slug ] ),
        'headers'  => [ 'Content-Type' => 'application/json' ],
        'timeout'  => 5,
        'blocking' => false, // fire and forget
    ] );
}

// Автоматично тригерити revalidate при збереженні сторінки
add_action( 'save_post_page', function ( $post_id ) {
    if ( wp_is_post_revision( $post_id ) || wp_is_post_autosave( $post_id ) ) {
        return;
    }
    $slug = '/' . ltrim( get_page_uri( $post_id ), '/' );
    racqueteer_send_revalidate( $slug );
}, 10, 1 );

// Phase 7 — Тригер при зміні статусу сторінки (publish ↔ draft)
// Це дозволяє: Draft → сторінка стає 404, Publish → сторінка знову live
add_action( 'transition_post_status', function ( $new_status, $old_status, $post ) {
    if ( $post->post_type !== 'page' ) {
        return;
    }
    if ( $new_status === $old_status ) {
        return;
    }
    $slug = '/' . ltrim( get_page_uri( $post->ID ), '/' );
    racqueteer_send_revalidate( $slug );
}, 10, 3 );

// Phase 8 — Revalidate layout (Navbar/Footer) при зміні ACF Options
add_action( 'acf/save_post', function ( $post_id ) {
    // Options pages мають string post_id типу 'options' або 'acf-options-navbar' тощо
    if ( ! is_string( $post_id ) && ! str_contains( (string) $post_id, 'options' ) ) {
        return;
    }
    if ( str_contains( (string) $post_id, 'option' ) ) {
        // Оновлюємо всі основні сторінки, де є Navbar/Footer (через layout)
        $pages = [ '/', '/memberships', '/private-events', '/about', '/careers' ];
        foreach ( $pages as $slug ) {
            racqueteer_send_revalidate( $slug );
        }
    }
}, 20 );

// Сторінка налаштувань у WP Admin
add_action( 'admin_menu', function () {
    add_options_page(
        'Racqueteer Settings',
        'Racqueteer',
        'manage_options',
        'racqueteer-settings',
        'racqueteer_settings_page'
    );
} );

function racqueteer_settings_page() {
    if ( isset( $_POST['racqueteer_save'] ) ) {
        check_admin_referer( 'racqueteer_settings' );
        update_option( 'racqueteer_nextjs_url',        sanitize_url( $_POST['nextjs_url'] ) );
        update_option( 'racqueteer_revalidate_secret', sanitize_text_field( $_POST['revalidate_secret'] ) );
        echo '<div class="notice notice-success"><p>Settings saved!</p></div>';
    }
    $nextjs_url = get_option( 'racqueteer_nextjs_url', '' );
    $secret     = get_option( 'racqueteer_revalidate_secret', '' );
    ?>
    <div class="wrap">
        <h1>Racqueteer Settings</h1>
        <form method="post">
            <?php wp_nonce_field( 'racqueteer_settings' ); ?>
            <table class="form-table">
                <tr>
                    <th>Next.js URL</th>
                    <td><input type="url" name="nextjs_url" value="<?php echo esc_attr( $nextjs_url ); ?>" class="regular-text" placeholder="https://racqueteer.com" /></td>
                </tr>
                <tr>
                    <th>Revalidate Secret</th>
                    <td><input type="text" name="revalidate_secret" value="<?php echo esc_attr( $secret ); ?>" class="regular-text" /></td>
                </tr>
            </table>
            <p class="submit"><button type="submit" name="racqueteer_save" class="button button-primary">Save Settings</button></p>
        </form>
        <hr>
        <h2>How to Use</h2>
        <ol>
            <li>Set <strong>Next.js URL</strong> to your Vercel deployment URL (e.g. <code>https://racqueteer.vercel.app</code>).</li>
            <li>Set <strong>Revalidate Secret</strong> — must match <code>REVALIDATE_SECRET</code> in your Vercel environment variables.</li>
            <li>Go to <strong>Site Settings → Navbar</strong> to edit navigation links, logo and CTA button.</li>
            <li>Go to <strong>Site Settings → Footer</strong> to edit footer content, locations and legal links.</li>
        </ol>
    </div>
    <?php
}


