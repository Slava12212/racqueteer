<?php
/**
 * Demo Content Importer
 *
 * Додає сторінку Tools → 🎾 Racqueteer Import у WP Admin.
 * Автоматично створює всі сторінки, CPT записи та налаштування сайту.
 *
 * Підключається через functions.php:
 *   require_once RACQUETEER_DIR . '/inc/demo-content.php';
 *
 * @package Racqueteer
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ─────────────────────────────────────────────
// Admin menu (Tools → Racqueteer Import)
// ─────────────────────────────────────────────

add_action( 'admin_menu', function () {
    add_management_page(
        'Racqueteer Demo Import',
        '🎾 Racqueteer Import',
        'manage_options',
        'rq-demo-import',
        'rq_demo_admin_page'
    );
} );

function rq_demo_admin_page(): void {
    if ( ! current_user_can( 'manage_options' ) ) {
        return;
    }

    $results  = [];
    $gql_logs = [];
    $error    = '';

    if ( isset( $_POST['rq_import'] ) && check_admin_referer( 'rq_demo_import' ) ) {
        try {
            $results = rq_run_import();
        } catch ( \Throwable $e ) {
            $error = $e->getMessage();
        }
    }

    if ( isset( $_POST['rq_verify_gql'] ) && check_admin_referer( 'rq_demo_import' ) ) {
        $gql_logs = rq_verify_graphql();
    }

    $already = get_option( 'rq_demo_imported', false );
    $nextjs  = get_option( 'racqueteer_nextjs_url', '' );
    ?>
    <div class="wrap">
        <h1>🎾 Racqueteer — Demo Content Importer</h1>

        <?php if ( $error ) : ?>
            <div class="notice notice-error"><p><strong>Error:</strong> <?php echo esc_html( $error ); ?></p></div>
        <?php endif; ?>

        <?php if ( $results ) : ?>
            <div class="notice notice-success is-dismissible">
                <p><strong>✅ Import completed!</strong></p>
                <ul style="list-style:disc;margin-left:20px;">
                    <?php foreach ( $results as $line ) : ?>
                        <li><?php echo esc_html( $line ); ?></li>
                    <?php endforeach; ?>
                </ul>
                <p style="margin-top:12px;"><strong>Перевірте блоки в Gutenberg:</strong></p>
                <ul style="list-style:none;margin-left:0;">
                    <?php
                    $check_pages = [ 'home' => 'Home', 'memberships' => 'Memberships', 'private-events' => 'Private Events', 'about' => 'About', 'careers' => 'Careers' ];
                    foreach ( $check_pages as $slug => $label ) :
                        $p = get_page_by_path( $slug );
                        if ( $p ) :
                    ?>
                        <li>
                            <a href="<?php echo esc_url( get_edit_post_link( $p->ID ) ); ?>" target="_blank">
                                🗒️ Edit <?php echo esc_html( $label ); ?> (ID <?php echo (int) $p->ID; ?>)
                            </a>
                            — перевірте, що блоки відображаються з полями
                        </li>
                    <?php endif; endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

        <?php if ( $gql_logs ) :
            $has_errors = ! empty( array_filter( $gql_logs, fn( $l ) => str_contains( $l, '❌' ) ) );
        ?>
            <div class="notice <?php echo $has_errors ? 'notice-warning' : 'notice-success'; ?> is-dismissible">
                <p><strong><?php echo $has_errors ? '⚠️ GraphQL Verification — є проблеми' : '✅ GraphQL Verification — все OK!'; ?></strong></p>
                <ul style="list-style:none;margin:8px 0 0;padding:0;font-family:monospace;font-size:12px;line-height:1.8;">
                    <?php foreach ( $gql_logs as $line ) :
                        $color = str_contains( $line, '✅' ) ? '#00a32a' : ( str_contains( $line, '❌' ) ? '#d63638' : ( str_contains( $line, '⚠' ) ? '#dba617' : '#50575e' ) );
                    ?>
                        <li style="color:<?php echo $color; ?>"><?php echo esc_html( $line ); ?></li>
                    <?php endforeach; ?>
                </ul>
            </div>
        <?php endif; ?>

    <div style="background:#fff;padding:24px;border:1px solid #ccd0d4;max-width:720px;margin-top:16px;">

        <h2 style="margin-top:0;">🔍 Перевірка системи</h2>
        <?php
        $checks = [
            'ACF Pro'                   => class_exists( 'ACF' ),
            'WPGraphQL'                 => defined( 'WPGRAPHQL_VERSION' ) || function_exists( 'graphql' ),
            'WPGraphQL for ACF'         => function_exists( 'wpgraphql_acf' ) || defined( 'WPGRAPHQL_FOR_ACF_VERSION' ),
            'WPGraphQL Content Blocks'  => rq_detect_content_blocks_plugin(),
            'Permalinks /%postname%/'   => get_option( 'permalink_structure' ) === '/%postname%/',
            'WPGraphQL Introspection'   => ( function() {
                $s = get_option( 'graphql_general_settings', [] );
                return is_array( $s ) && ( $s['public_introspection_enabled'] ?? '' ) === 'on';
            } )(),
        ];
        $all_ok = ! in_array( false, $checks, true );
        ?>
        <table style="border-collapse:collapse;width:100%;margin-bottom:16px;">
            <?php foreach ( $checks as $label => $ok ) : ?>
            <tr style="border-bottom:1px solid #f0f0f0;">
                <td style="padding:6px 10px;font-size:13px;"><?php echo $ok ? '✅' : '❌'; ?></td>
                <td style="padding:6px 10px;font-size:13px;"><?php echo esc_html( $label ); ?></td>
                <td style="padding:6px 10px;font-size:12px;color:#8c8f94;"><?php echo $ok ? 'OK' : '<strong style="color:#d63638">Потрібно встановити/налаштувати</strong>'; ?></td>
            </tr>
            <?php endforeach; ?>
        </table>
        <?php if ( ! $all_ok ) : ?>
        <div class="notice notice-warning inline" style="margin:0 0 16px;">
            <p>❗ <strong>Є незаповнені умови.</strong> Натисніть Import — він автоматично налаштує те що може (permalinks, WPGraphQL settings).
            ACF Pro, WPGraphQL та WPGraphQL for ACF потрібно встановити вручну в <a href="<?php echo esc_url( admin_url( 'plugins.php' ) ); ?>">Plugins</a>.</p>
        </div>
        <?php endif; ?>

        <h2>Що буде створено / налаштовано</h2>
        <ul style="list-style:disc;margin-left:20px;line-height:1.8;">
            <li><strong>⚙️ WordPress Settings:</strong> Permalinks → /%postname%/, Timezone → Sydney, коментарі вимкнено</li>
            <li><strong>⚙️ WPGraphQL Settings:</strong> public introspection ON, batch queries ON</li>
            <li><strong>Сторінки (5):</strong> Home, Memberships, Private Events, About, Careers</li>
            <li><strong>Кожна сторінка</strong> вже матиме правильні ACF Gutenberg блоки з контентом</li>
            <li><strong>Jobs (8)</strong> — вакансії для сторінки Careers</li>
            <li><strong>Testimonials (6)</strong> — відгуки</li>
            <li><strong>Locations (2)</strong> — Homebush &amp; Alexandria</li>
            <li><strong>Programs (4)</strong> — програми тренувань</li>
            <li><strong>Membership Plans (4)</strong> — Starter, Light, Pro, Pro+</li>
            <li><strong>Navbar &amp; Footer ACF Options</strong> — посилання, CTA, контакти</li>
            <li><strong>Reading Settings</strong> — Home встановлюється як front page</li>
        </ul>

            <details style="margin-top:16px;">
                <summary style="cursor:pointer;font-weight:600;color:#2271b1;">🔍 Як саме зберігаються ACF блоки?</summary>
                <div style="margin-top:10px;background:#f6f7f7;padding:12px;border-radius:4px;font-family:monospace;font-size:11px;overflow-x:auto;">
                    <pre style="margin:0;white-space:pre-wrap;"><?php
                    // Live preview of what the Hero block will look like in the DB
                    $preview = rq_acf_block( 'acf/racqueteer-hero', [
                        'title'             => 'Where Elite Competition Meets a Refined Social Atmosphere',
                        '_title'            => 'field_hero_title',
                        'cta_primary_text'  => 'Book a Court',
                        '_cta_primary_text' => 'field_hero_cta_primary_text',
                        'video_url'         => 'https://racqueteer.vercel.app/hero-video.mp4',
                        '_video_url'        => 'field_hero_video',
                    ] );
                    echo esc_html( rtrim( $preview ) );
                    ?></pre>
                </div>
                <p style="margin:8px 0 0;font-size:12px;color:#50575e;">
                    Кожен блок зберігається як Gutenberg block comment з inline даними (<code>"data":{...}</code>)
                    та унікальним <code>"id":"block_..."</code>. ACF читає дані через <code>acf_setup_meta()</code>,
                    WPGraphQL for ACF — через GraphQL resolver.
                </p>
            </details>

            <?php if ( empty( $nextjs ) ) : ?>
                <div class="notice notice-warning inline" style="margin:12px 0;">
                    <p>⚠️ <strong>Увага:</strong> Next.js URL не налаштовано.
                    Перейдіть в <a href="<?php echo esc_url( admin_url( 'options-general.php?page=racqueteer-settings' ) ); ?>">Settings → Racqueteer</a>
                    і вкажіть URL деплою (наприклад <code>https://racqueteer.vercel.app</code>),
                    щоб відео/зображення правильно завантажились до медіабібліотеки.</p>
                </div>
            <?php endif; ?>

            <?php if ( $already ) : ?>
                <div class="notice notice-info inline" style="margin:12px 0;">
                    <p>ℹ️ Контент вже імпортувався: <strong><?php echo esc_html( $already ); ?></strong>.
                    Повторний запуск оновить наявний контент (не дублює).</p>
                </div>
            <?php endif; ?>

            <form method="post" style="margin-top:16px;display:flex;gap:10px;align-items:center;flex-wrap:wrap;">
                <?php wp_nonce_field( 'rq_demo_import' ); ?>
                <button type="submit" name="rq_import" class="button button-primary" style="font-size:15px;height:40px;padding:0 24px;">
                    🚀 <?php echo $already ? 'Re-import Demo Content' : 'Import Demo Content'; ?>
                </button>
                <button type="submit" name="rq_verify_gql" class="button button-secondary" style="font-size:14px;height:40px;padding:0 20px;">
                    🔍 Verify GraphQL
                </button>
            </form>

            <div style="margin-top:20px;padding-top:16px;border-top:1px solid #f0f0f0;">
                <p style="margin:0 0 8px;font-weight:600;font-size:13px;">🔗 Корисні посилання після імпорту:</p>
                <ul style="list-style:none;margin:0;padding:0;font-size:13px;line-height:2;">
                    <li>📡 <a href="<?php echo esc_url( home_url( '/graphql' ) ); ?>" target="_blank"><?php echo esc_html( home_url( '/graphql' ) ); ?></a> — GraphQL endpoint (має відповідати JSON)</li>
                    <li>📋 <a href="<?php echo esc_url( admin_url( 'admin.php?page=graphiql-ide' ) ); ?>" target="_blank">GraphiQL IDE</a> — тестувати GraphQL запити прямо в браузері</li>
                    <li>⚙️ <a href="<?php echo esc_url( admin_url( 'admin.php?page=graphql-settings' ) ); ?>" target="_blank">WPGraphQL Settings</a> — налаштування плагіну</li>
                    <li>🔧 <a href="<?php echo esc_url( admin_url( 'options-permalink.php' ) ); ?>" target="_blank">Permalinks Settings</a> — перевірити структуру</li>
                </ul>
            </div>
        </div>
    </div>
    <?php
}

// ─────────────────────────────────────────────
// Main import orchestrator
// ─────────────────────────────────────────────

function rq_run_import(): array {
    $log    = [];
    $nextjs = trailingslashit( get_option( 'racqueteer_nextjs_url', 'https://racqueteer.vercel.app' ) );

    require_once ABSPATH . 'wp-admin/includes/image.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';

    $log[] = '— Configuring WordPress & WPGraphQL settings…';
    rq_configure_wp_settings( $log );

    $log[] = '— Importing media assets…';
    $media = rq_import_media( $nextjs, $log );

    $log[] = '— Creating Jobs…';
    rq_create_jobs( $log );

    $log[] = '— Creating Testimonials…';
    rq_create_testimonials( $log );

    $log[] = '— Creating Locations…';
    rq_create_locations( $media, $log );

    $log[] = '— Creating Programs…';
    rq_create_programs( $log );

    $log[] = '— Creating Membership Plans…';
    rq_create_membership_plans( $log );

    $log[] = '— Creating page: Home…';
    rq_create_page_home( $nextjs, $media, $log );

    $log[] = '— Creating page: Memberships…';
    rq_create_page_memberships( $nextjs, $media, $log );

    $log[] = '— Creating page: Private Events…';
    rq_create_page_private_events( $nextjs, $media, $log );

    $log[] = '— Creating page: About…';
    rq_create_page_about( $nextjs, $media, $log );

    $log[] = '— Creating page: Careers…';
    rq_create_page_careers( $nextjs, $media, $log );

    $log[] = '— Setting site options (Navbar / Footer)…';
    rq_set_site_options( $media, $log );

    update_option( 'rq_demo_imported', current_time( 'mysql' ) );
    $log[] = '✅ All done!';

    return $log;
}

// ─────────────────────────────────────────────
// GRAPHQL VERIFICATION
// ─────────────────────────────────────────────

/**
 * Runs a series of GraphQL queries against the local /graphql endpoint
 * and returns a detailed log of what works and what doesn't.
 */
/**
 * Detect WPGraphQL Content Blocks plugin regardless of slug/folder name.
 */
function rq_detect_content_blocks_plugin(): bool {
    // 1. Constants / classes set by the plugin at runtime
    if ( defined( 'WPGRAPHQL_CONTENT_BLOCKS_VERSION' ) ) {
        return true;
    }
    if ( class_exists( 'WPGraphQL\ContentBlocks\Plugin' ) ) {
        return true;
    }
    // 2. Check via is_plugin_active() — covers all common folder/slug variants
    if ( function_exists( 'is_plugin_active' ) ) {
        $slugs = [
            'wp-graphql-content-blocks/wp-graphql-content-blocks.php',
            'wpgraphql-content-blocks/wp-graphql-content-blocks.php',
            'wpgraphql-content-blocks/wpgraphql-content-blocks.php',
        ];
        foreach ( $slugs as $slug ) {
            if ( is_plugin_active( $slug ) ) {
                return true;
            }
        }
    }
    // 3. Fallback: scan active_plugins option directly
    $active = (array) get_option( 'active_plugins', [] );
    foreach ( $active as $plugin ) {
        if ( str_contains( strtolower( $plugin ), 'content-blocks' ) ) {
            return true;
        }
    }
    return false;
}

function rq_verify_graphql(): array {
    $log = [];
    $url = home_url( '/graphql' );
    $log[] = "GraphQL endpoint: {$url}";
    $log[] = str_repeat( '─', 50 );

    // Helper: POST a query, return [ok, data|error_message]
    $query = function ( string $gql ) use ( $url ): array {
        $resp = wp_remote_post( $url, [
            'headers'   => [ 'Content-Type' => 'application/json' ],
            'body'      => wp_json_encode( [ 'query' => $gql ] ),
            'timeout'   => 15,
            'sslverify' => false,
        ] );
        if ( is_wp_error( $resp ) ) {
            return [ false, $resp->get_error_message() ];
        }
        $http_code = (int) wp_remote_retrieve_response_code( $resp );
        $raw_body  = wp_remote_retrieve_body( $resp );
        if ( $http_code >= 500 ) {
            // Server-level error — extract a short hint from the body if possible
            $hint = '';
            if ( preg_match( '/<b>Fatal error<\/b>:\s*(.*?)(?:\s+in\s+|<\/b>)/i', $raw_body, $m ) ) {
                $hint = ': ' . strip_tags( $m[1] );
            } elseif ( preg_match( '/(?:Fatal error|Parse error|Warning)[:\s]+(.{0,120})/i', $raw_body, $m ) ) {
                $hint = ': ' . strip_tags( $m[1] );
            }
            return [ false, "HTTP {$http_code}{$hint} — check server PHP error log or wp-debug.log" ];
        }
        $body = json_decode( $raw_body, true );
        if ( ! is_array( $body ) ) {
            return [ false, "HTTP {$http_code} — endpoint did not return JSON. WPGraphQL may not be active." ];
        }
        if ( ! empty( $body['errors'] ) ) {
            return [ false, $body['errors'][0]['message'] ?? 'Unknown GraphQL error' ];
        }
        return [ true, $body['data'] ?? [] ];
    };

    // ── 1. Endpoint reachable ────────────────────────────────────────────────
    $log[] = '';
    $log[] = '1. Endpoint & Introspection';

    // Show any stored PHP fatal error BEFORE testing (helps debug 500 errors)
    $last_fatal = get_option( 'rq_last_fatal', '' );
    if ( $last_fatal ) {
        $log[] = '  ❌ Last PHP Fatal (from rq_last_fatal): ' . $last_fatal;
        $log[] = '     → Виправ цю помилку та спробуй знову.';
        delete_option( 'rq_last_fatal' );
    }

    [ $ok, $data ] = $query( '{ __typename }' );
    if ( $ok ) {
        $log[] = "  ✅ Endpoint reachable — {$url}";
    } else {
        $log[] = "  ❌ Endpoint NOT reachable: {$data}";
        $log[] = '  ⚠ Зупиняємо перевірку — WPGraphQL недоступний';
        return $log;
    }

    // ── 1b. Schema check: Page.blocks field & ACF block types ────────────────
    $log[] = '';
    $log[] = '1b. Schema — поля та типи';

    // Check if Page has blocks field
    [ $ok, $data ] = $query( '{ __type(name:"Page") { fields { name } } }' );
    if ( $ok ) {
        $fields     = array_column( $data['__type']['fields'] ?? [], 'name' );
        $has_blocks = in_array( 'blocks', $fields, true );
        if ( $has_blocks ) {
            $log[] = '  ✅ Page.blocks — поле є в схемі (WPGraphQL Content Blocks активний)';
        } else {
            $log[] = '  ❌ Page.blocks — поля НЕМАЄ у схемі! Переконайся що WPGraphQL Content Blocks активний і сумісний';
            $log[] = '     Доступні поля Page: ' . implode( ', ', array_slice( $fields, 0, 15 ) );
        }
    } else {
        $log[] = "  ⚠ Schema introspection failed: {$data}";
    }

    // Introspect Block interface — get field TYPES for accurate diagnostics
    $type_to_str = function ( $t ) use ( &$type_to_str ) {
        if ( ! is_array( $t ) ) return '?';
        $kind = $t['kind'] ?? '';
        $name = $t['name'] ?? '';
        if ( $name ) return $name;
        if ( ! empty( $t['ofType'] ) ) return $kind . '(' . $type_to_str( $t['ofType'] ) . ')';
        return $kind ?: '?';
    };
    [ $ok, $data ] = $query( '{ __type(name:"Block") { name kind fields { name type { kind name ofType { kind name ofType { kind name } } } } } }' );
    if ( $ok && ! empty( $data['__type'] ) ) {
        $block_iface_fields = $data['__type']['fields'] ?? [];
        $field_names  = array_column( $block_iface_fields, 'name' );
        $has_name     = in_array( 'name', $field_names, true );
        $log[] = '  ℹ Block interface fields: ' . implode( ', ', $field_names );
        $log[] = '  ℹ Block.name ' . ( $has_name ? 'available (use name OR __typename)' : 'NOT in interface — use __typename (this is normal)' );
        // Show connections type for debugging
        foreach ( $block_iface_fields as $bf ) {
            if ( $bf['name'] === 'connections' ) {
                $t = $bf['type'];
                $t_str = $t['name'] ?? ( ( $t['kind'] ?? '' ) . ':' . ( $t['ofType']['name'] ?? ( $t['ofType']['kind'] ?? '?' ) ) );
                $log[] = '  ℹ Block.connections type: ' . $t_str;
            }
            if ( $bf['name'] === 'attributes' ) {
                $t = $bf['type'];
                $t_str = $t['name'] ?? ( $t['ofType']['name'] ?? '?' );
                $log[] = '  ℹ Block.attributes type: ' . $t_str;
            }
        }
    } else {
        $log[] = '  ℹ Block type not found in schema (WPGraphQL Content Blocks uses a different interface name)';
    }

    // Check BlockAttributesInterface
    [ $ok, $data ] = $query( '{ __type(name:"BlockAttributesInterface") { name kind fields { name } } }' );
    if ( $ok && ! empty( $data['__type'] ) ) {
        $bai_fields = array_column( $data['__type']['fields'] ?? [], 'name' );
        $log[] = '  ℹ BlockAttributesInterface fields: ' . implode( ', ', $bai_fields );
    }

    // Check a known core block to see what implements Block (diagnosis)
    [ $ok, $data ] = $query( '{ __type(name:"CoreParagraphBlock") { name interfaces { name } fields { name } } }' );
    if ( $ok && ! empty( $data['__type'] ) ) {
        $cb_ifaces = array_column( $data['__type']['interfaces'] ?? [], 'name' );
        $log[] = '  ℹ CoreParagraphBlock interfaces: ' . implode( ', ', $cb_ifaces );
    }

    // Check block registration errors logged by graphql-extensions.php
    $reg_errors = get_option( 'rq_block_type_reg_errors', '' );
    if ( $reg_errors ) {
        $log[] = '  ❌ Block type registration errors (from graphql-extensions.php):';
        foreach ( explode( ' | ', $reg_errors ) as $err ) {
            $log[] = '     ' . $err;
        }
    }

    // ── Deployment check: did the server get the updated graphql-extensions.php?
    $acf_gql_ver = defined( 'WPGRAPHQL_FOR_ACF_VERSION' ) ? WPGRAPHQL_FOR_ACF_VERSION : 'не активний';
    $log[] = '  ℹ WPGraphQL for ACF version: ' . $acf_gql_ver;

    [ $ok_deploy, $data_deploy ] = $query( '{ __type(name:"LocationStatus") { name } }' );
    $new_theme_deployed = $ok_deploy && ! empty( $data_deploy['__type'] );
    if ( $new_theme_deployed ) {
        $log[] = '  ✅ LocationStatus enum — новий graphql-extensions.php задеплоєний';
    } else {
        $log[] = '  ❌ LocationStatus — тип НЕ знайдено → graphql-extensions.php не задеплоєний або PHP error';
        $log[] = '     → ДІЯ: завантажте wp/inc/graphql-extensions.php на сервер (FTP / SFTP / cPanel)';
    }

    // Check deployment sentinel
    [ $ok_v, $data_v ] = $query( '{ __type(name:"RqDeployVersion") { name enumValues { name } } }' );
    if ( $ok_v && ! empty( $data_v['__type'] ) ) {
        $enum_vals = array_column( $data_v['__type']['enumValues'] ?? [], 'name' );
        $ver = implode( ', ', $enum_vals );
        if ( in_array( 'v18', $enum_vals ) ) {
            $log[] = '  ✅ RqDeployVersion ' . $ver . ' — graphql-extensions.php v18 (Strategy G+H: АКТИВНИЙ)';
        } elseif ( in_array( 'v17', $enum_vals ) ) {
            $log[] = '  ✅ RqDeployVersion ' . $ver . ' — graphql-extensions.php v17 (Strategy G: schema OK, Strategy H: runtime fix)';
        } elseif ( in_array( 'v16', $enum_vals ) ) {
            $log[] = '  ⚠ RqDeployVersion ' . $ver . ' — v16 (schema may lack Block interface). Задеплой v18.';
        } elseif ( in_array( 'v15', $enum_vals ) ) {
            $log[] = '  ⚠ RqDeployVersion ' . $ver . ' — v15 (HTTP 500 ризик). Задеплой v18 graphql-extensions.php.';
        } elseif ( in_array( 'v14', $enum_vals ) ) {
            $log[] = '  ⚠ RqDeployVersion ' . $ver . ' — v14. Задеплой graphql-extensions.php v18.';
        } else {
            $log[] = '  ⚠ RqDeployVersion ' . $ver . ' — застаріла версія. Задеплой новий graphql-extensions.php (v18).';
        }
    } else {
        $log[] = '  ❌ RqDeployVersion не знайдено → задеплой wp/inc/graphql-extensions.php (v18)';
    }

    // ── v16 diagnostics: TypeRegistry + Strategy E priority-1 ────────────────
    $ifaces_in_reg  = get_option( 'rq_diag_ifaces_in_reg', '' );
    $extra_ifaces   = get_option( 'rq_diag_extra_ifaces', '' );
    $typemap_p99    = get_option( 'rq_diag_v16_typemap_p99', '' );
    $strat_e        = get_option( 'rq_diag_strategy_e', '' );
    $strat_d        = get_option( 'rq_diag_strategy_d', '' );

    $log[] = '';
    $log[] = '  ── v18 DIAGNOSTICS: TypeRegistry + Strategy G/H ──';

    // Strategy G / H diagnostics
    $strat_g = get_option( 'rq_diag_strategy_g', '' );
    if ( $strat_g ) {
        if ( false !== strpos( $strat_g, 'Block:ok' ) ) {
            $log[] = '  ✅ Strategy G: ' . $strat_g . ' — Block/EditorBlock pre-registered at priority 1 ✓';
        } else {
            $log[] = '  ⚠ Strategy G: ' . $strat_g;
        }
    }

    $blocks_resolver = get_option( 'rq_diag_blocks_resolver', '' );
    if ( $blocks_resolver ) {
        if ( is_array( $blocks_resolver ) ) {
            $acf_count = $blocks_resolver['acf_count'] ?? 0;
            $raw_count = $blocks_resolver['raw_count'] ?? 0;
            $types     = implode( ', ', (array) ( $blocks_resolver['types'] ?? [] ) );
            if ( $acf_count > 0 ) {
                $log[] = '  ✅ Strategy H (blocks resolver): post_id=' . $blocks_resolver['post_id'] . ', raw=' . $raw_count . ', acf=' . $acf_count . ' → ' . $types;
            } else {
                $log[] = '  ⚠ Strategy H (blocks resolver): raw=' . $raw_count . ', acf=' . $acf_count . ' (0 ACF blocks found — re-run Import)';
            }
        } else {
            $log[] = '  ℹ Strategy H: ' . $blocks_resolver;
        }
    }

    if ( $ifaces_in_reg ) {
        $log[] = '  TypeRegistry @p99: ' . $ifaces_in_reg;
    }
    if ( $typemap_p99 ) {
        $log[] = '  TypeRegistry map @p99 (first 40 keys): ' . $typemap_p99;
    }

    // KEY DIAGNOSTIC: extra_type_interfaces shows if Strategy E priority-1 worked
    if ( $extra_ifaces ) {
        if ( false !== strpos( $extra_ifaces, '[HeroBlock]=Block' ) || false !== strpos( $extra_ifaces, '[HeroBlock]=EditorBlock' ) || false !== strpos( $extra_ifaces, 'HeroBlock]=Block' ) ) {
            $log[] = '  ✅ extra_type_interfaces: ' . $extra_ifaces . ' — Strategy E priority-1 WORKED!';
            $log[] = '     Block/EditorBlock queued for injection into AcfRacqueteer*Block during type build.';
        } elseif ( false !== strpos( $extra_ifaces, 'HeroBlock=missing' ) ) {
            $log[] = '  ⚠ extra_type_interfaces: ' . $extra_ifaces . ' — HeroBlock NOT in extra_type_interfaces';
            $log[] = '     Strategy E priority-1 did NOT queue Block injection. Possible causes:';
            $log[] = '     1. register_graphql_interfaces_to_types() not found → check Strategy E diagnostic';
            $log[] = '     2. TypeRegistry uses different property name';
        } else {
            $log[] = '  ℹ extra_type_interfaces: ' . $extra_ifaces;
        }
    } else {
        $log[] = '  ⚠ rq_diag_extra_ifaces not set — trigger a GraphQL query to populate';
    }

    if ( $strat_e ) {
        if ( false !== strpos( $strat_e, 'fired_priority_1:ok' ) ) {
            $log[] = '  ✅ Strategy E: ' . $strat_e . ' — called at priority 1, internal action queued at priority 10 ✓';
        } elseif ( false !== strpos( $strat_e, 'SKIP' ) ) {
            $log[] = '  ❌ Strategy E: ' . $strat_e . ' — register_graphql_interfaces_to_types() не знайдено!';
            $log[] = '     → Оновіть WPGraphQL до версії що підтримує цю функцію, або використай fallback.';
        } else {
            $log[] = '  ℹ Strategy E: ' . $strat_e;
        }
    } else {
        $log[] = '  ⚠ Strategy E: not triggered yet';
    }

    if ( $strat_d ) {
        $log[] = '  ✅ Strategy D (graphql_object_type_config): ' . $strat_d;
    }

    // ── Strategy A / B ──
    $strat_a = get_option( 'rq_diag_strategy_a', '' );
    $strat_b = get_option( 'rq_diag_strategy_b', '' );
    $type_names_opt = get_option( 'rq_diag_type_names', array() );

    if ( $strat_a ) {
        $log[] = '  ✅ Strategy A (wpgraphql_acf_block_type_config): ' . $strat_a;
    } else {
        $log[] = '  ℹ Strategy A (wpgraphql_acf_block_type_config): не спрацював — WPGraphQL for ACF не використовує цей хук';
    }
    if ( $strat_b ) {
        $log[] = '  ✅ Strategy B (graphql_wp_object_type_config): ' . $strat_b;
    } else {
        $log[] = '  ℹ Strategy B (graphql_wp_object_type_config): не спрацював';
    }
    if ( ! empty( $type_names_opt ) && is_array( $type_names_opt ) ) {
        $log[] = '  ℹ Acf* типи в graphql_wp_object_type_config: ' . implode( ', ', array_keys( $type_names_opt ) );
    }
    // Clear diagnostics after display so next run is fresh
    delete_option( 'rq_diag_strategy_a' );
    delete_option( 'rq_diag_strategy_b' );
    delete_option( 'rq_diag_strategy_d' );
    delete_option( 'rq_diag_strategy_e' );
    delete_option( 'rq_diag_type_names' );
    delete_option( 'rq_diag_ifaces_in_reg' );
    delete_option( 'rq_diag_extra_ifaces' );
    delete_option( 'rq_diag_v16_typemap_p99' );
    // Legacy options cleanup
    delete_option( 'rq_diag_strategy_f' );
    delete_option( 'rq_diag_reg_iface_names' );
    delete_option( 'rq_diag_v15_reg9999' );
    delete_option( 'rq_diag_v15_typemap_sample' );
    delete_option( 'rq_diag_cb_classes' );

    // Manual fallback check (only applies for WPGraphQL for ACF < v2)
    [ $ok_rq, $data_rq ] = $query( '{ __type(name:"RqRacqueteerHeroFields") { name } }' );
    if ( $ok_rq && ! empty( $data_rq['__type'] ) ) {
        $log[] = '  ✅ RqRacqueteerHeroFields — manual block type fallback active (для старих версій)';
    }

    // Check if AcfRacqueteerHeroBlock type exists and implements Block interface
    [ $ok, $data ] = $query( '{ __type(name:"AcfRacqueteerHeroBlock") { name kind fields { name type { kind name ofType { kind name ofType { kind name } } } } interfaces { name } } }' );
    if ( $ok && ! empty( $data['__type'] ) ) {
        $hero_fields_full = $data['__type']['fields'] ?? [];
        $block_fields     = array_column( $hero_fields_full, 'name' );
        $block_interfaces = array_column( $data['__type']['interfaces'] ?? [], 'name' );
        $implements_block = in_array( 'Block', $block_interfaces, true )
                         || in_array( 'EditorBlock', $block_interfaces, true )
                         || in_array( 'ContentBlock', $block_interfaces, true );
        $log[] = '  ✅ AcfRacqueteerHeroBlock — тип є в схемі';
        $log[] = '     Fields: ' . implode( ', ', $block_fields );
        $log[] = '     Interfaces: ' . ( $block_interfaces ? implode( ', ', $block_interfaces ) : 'none' );

        // Detailed field signature check vs Block contract
        $hero_sig = [];
        foreach ( $hero_fields_full as $f ) {
            $hero_sig[ $f['name'] ?? '' ] = $type_to_str( $f['type'] ?? [] );
        }
        foreach ( [ 'id', 'type', 'tagName', 'innerHtml', 'attributes', 'connections' ] as $req ) {
            if ( isset( $hero_sig[ $req ] ) ) {
                $log[] = '     Hero.' . $req . ' type: ' . $hero_sig[ $req ];
            } else {
                $log[] = '     Hero.' . $req . ' type: <missing>';
            }
        }
        if ( $implements_block ) {
            $log[] = '  ✅ AcfRacqueteerHeroBlock implements Block → Page.blocks will work!';
        } else {
            $log[] = '  ❌ AcfRacqueteerHeroBlock does NOT implement Block interface → Page.blocks returns 0';
            $log[] = '     → Deploy graphql-extensions.php v18 (Strategy G: pre-register Block at priority 1)';
        }
    } else {
        $log[] = '  ❌ AcfRacqueteerHeroBlock — типу НЕМАЄ у схемі!';
        if ( $new_theme_deployed ) {
            $log[] = '     graphql-extensions.php задеплоєний, але реєстрація типів не спрацювала.';
            $log[] = '     Перевір PHP fatal errors у wp-content/debug.log (увімкни WP_DEBUG_LOG=true)';
        } else {
            $log[] = '     graphql-extensions.php НЕ задеплоєний — завантаж на сервер (дивись ❌ вище)';
        }
        // List available types for reference
        [ $ok2, $data2 ] = $query( '{ __schema { types { name } } }' );
        if ( $ok2 ) {
            $all_types = array_column( $data2['__schema']['types'] ?? [], 'name' );
            $acf_types = array_values( array_filter( $all_types, function( $t ) { return strpos( $t, 'Acf' ) === 0; } ) );
            $rq_types  = array_values( array_filter( $all_types, function( $t ) { return strpos( $t, 'Rq' ) === 0; } ) );
            if ( $acf_types ) {
                $log[] = '     Знайдені Acf* типи: ' . implode( ', ', array_slice( $acf_types, 0, 10 ) );
            }
            if ( $rq_types ) {
                $log[] = '     ✅ Rq* (manual fallback) типи: ' . implode( ', ', $rq_types );
            } else {
                $log[] = '     Rq* типів немає — graphql-extensions.php з ручною реєстрацією не активний';
            }
        }
    }

    // ── 2. Pages & Blocks ───────────────────────────────────────────────────
    $log[] = '';
    $log[] = '2. Pages + ACF Blocks';
    $pages = [
        '/'              => 'Home',
        '/memberships'   => 'Memberships',
        '/private-events'=> 'Private Events',
        '/about'         => 'About',
        '/careers'       => 'Careers',
    ];
    foreach ( $pages as $uri => $label ) {
        // ── Direct DB check for raw post_content ─────────────────────────────
        // IMPORTANT: The GraphQL `content` field returns *rendered* HTML.
        // Our headless ACF blocks have render_callback that returns '' on frontend,
        // so rendered content is always empty — it cannot be used to detect stored blocks.
        // We instead read raw post_content from the WordPress DB directly.
        $raw_blocks_in_db = 0;
        if ( '/' === $uri ) {
            $front_id = (int) get_option( 'page_on_front' );
            if ( $front_id > 0 ) {
                $raw_content      = get_post_field( 'post_content', $front_id, 'raw' );
                $raw_blocks_in_db = substr_count( (string) $raw_content, '<!-- wp:acf/' );
            }
        } else {
            $db_page = get_page_by_path( ltrim( $uri, '/' ) );
            if ( $db_page ) {
                $raw_blocks_in_db = substr_count( (string) $db_page->post_content, '<!-- wp:acf/' );
            }
        }

        // ── GraphQL check for WPGraphQL Content Blocks integration ────────────
        [ $ok, $data ] = $query( '{ pageBy(uri:"' . $uri . '") { title blocks { __typename } } }' );
        if ( ! $ok ) {
            $log[] = "  ❌ {$label} ({$uri}): {$data}";
            continue;
        }
        $page_gql = $data['pageBy'] ?? null;
        if ( ! $page_gql ) {
            $log[] = "  ❌ {$label} ({$uri}): page not found (null) — run Import first!";
            continue;
        }
        $blocks   = $page_gql['blocks'] ?? [];
        $n_blocks = count( $blocks );

        if ( $n_blocks === 0 ) {
            if ( $raw_blocks_in_db > 0 ) {
                // Blocks ARE in DB but WPGraphQL Content Blocks can't expose them yet
                $log[] = "  ⚠ {$label} ({$uri}): {$raw_blocks_in_db} ACF blocks stored in DB — but WPGraphQL returns 0";
                $log[] = "     → Deploy graphql-extensions.php v18 (Strategy G: schema + Strategy H: resolver)";
                $log[] = "     → Check: WPGraphQL for ACF active + show_in_graphql=true in acf-blocks.php";
            } else {
                // Raw content is truly empty — Import didn't save block content
                $log[] = "  ❌ {$label} ({$uri}): page exists but has NO ACF block content in DB — re-run Import!";
            }
        } else {
            $type_names = implode( ', ', array_column( $blocks, '__typename' ) );
            $log[]      = "  ✅ {$label} ({$uri}): {$n_blocks} blocks → {$type_names}";
        }
    }

    // ── 3. CPT: Jobs ────────────────────────────────────────────────────────
    $log[] = '';
    $log[] = '3. CPT Queries';
    [ $ok, $data ] = $query( '{ jobs(first:3) { nodes { title jobFields { description category } } } }' );
    if ( ! $ok ) {
        $log[] = "  ❌ Jobs: {$data}";
    } else {
        $nodes = $data['jobs']['nodes'] ?? [];
        $count = count( $nodes );
        if ( $count === 0 ) {
            $log[] = '  ⚠ Jobs: query OK but 0 results — check CPT data';
        } else {
            $first_acf = $nodes[0]['jobFields'] ?? null;
            if ( $first_acf && ! empty( $first_acf['description'] ) ) {
                $log[] = "  ✅ Jobs: {$count} results — ACF fields OK (description: \"" . mb_substr( $first_acf['description'], 0, 40 ) . '…")';
            } else {
                $log[] = "  ⚠ Jobs: {$count} results but jobFields empty — check show_in_graphql + graphql_field_name";
            }
        }
    }

    // ── 4. CPT: Testimonials ────────────────────────────────────────────────
    [ $ok, $data ] = $query( '{ testimonials(first:3) { nodes { testimonialFields { authorName quote rating } } } }' );
    if ( ! $ok ) {
        $log[] = "  ❌ Testimonials: {$data}";
    } else {
        $nodes = $data['testimonials']['nodes'] ?? [];
        $count = count( $nodes );
        if ( $count === 0 ) {
            $log[] = '  ⚠ Testimonials: 0 results';
        } else {
            $first_acf = $nodes[0]['testimonialFields'] ?? null;
            $has_data  = $first_acf && ! empty( $first_acf['authorName'] );
            $log[]     = $has_data
                ? "  ✅ Testimonials: {$count} results — ACF OK (authorName: \"{$first_acf['authorName']}\")"
                : "  ⚠ Testimonials: {$count} results but testimonialFields empty";
        }
    }

    // ── 5. CPT: Locations ───────────────────────────────────────────────────
    [ $ok, $data ] = $query( '{ locations(first:3) { nodes { locationFields { name status locationId } } } }' );
    if ( ! $ok ) {
        $log[] = "  ❌ Locations: {$data}";
    } else {
        $nodes = $data['locations']['nodes'] ?? [];
        $count = count( $nodes );
        if ( $count === 0 ) {
            $log[] = '  ⚠ Locations: 0 results';
        } else {
            $first_acf = $nodes[0]['locationFields'] ?? null;
            $has_data  = $first_acf && ! empty( $first_acf['name'] );
            $log[]     = $has_data
                ? "  ✅ Locations: {$count} results — ACF OK (name: \"{$first_acf['name']}\")"
                : "  ⚠ Locations: {$count} results but locationFields empty";
        }
    }

    // ── 6. CPT: Programs ────────────────────────────────────────────────────
    [ $ok, $data ] = $query( '{ programs(first:3) { nodes { programFields { title price color } } } }' );
    if ( ! $ok ) {
        $log[] = "  ❌ Programs: {$data}";
    } else {
        $nodes = $data['programs']['nodes'] ?? [];
        $count = count( $nodes );
        if ( $count === 0 ) {
            $log[] = '  ⚠ Programs: 0 results';
        } else {
            $first_acf = $nodes[0]['programFields'] ?? null;
            $has_data  = $first_acf && ! empty( $first_acf['title'] );
            $log[]     = $has_data
                ? "  ✅ Programs: {$count} results — ACF OK (title: \"{$first_acf['title']}\")"
                : "  ⚠ Programs: {$count} results but programFields empty";
        }
    }

    // ── 7. CPT: Membership Plans ────────────────────────────────────────────
    [ $ok, $data ] = $query( '{ memberships(first:5) { nodes { title acf { price description buttonVariant } } } }' );
    if ( ! $ok ) {
        $log[] = "  ❌ Memberships: {$data}";
    } else {
        $nodes = $data['memberships']['nodes'] ?? [];
        $count = count( $nodes );
        if ( $count === 0 ) {
            $log[] = '  ⚠ Memberships: 0 results';
        } else {
            $first_acf = $nodes[0]['acf'] ?? null;
            $has_data  = $first_acf && ! empty( $first_acf['price'] );
            $log[]     = $has_data
                ? "  ✅ Memberships: {$count} results — ACF OK (price: \"{$first_acf['price']}\")"
                : "  ⚠ Memberships: {$count} results but ACF fields empty";
        }
    }

    // ── 8. Navbar Options ───────────────────────────────────────────────────
    $log[] = '';
    $log[] = '4. Site Options (Navbar + Footer)';
    [ $ok, $data ] = $query( '{ acfOptionsNavbar { navbar { navCtaText navLinks { label url } } } }' );
    if ( ! $ok ) {
        $log[] = "  ❌ Navbar options: {$data}";
        $log[] = '     → Перевір: WPGraphQL for ACF активний, Options Pages зареєстровані (theme-setup.php)';
    } else {
        $navbar = $data['acfOptionsNavbar']['navbar'] ?? null;
        if ( ! $navbar ) {
            $log[] = '  ⚠ Navbar: acfOptionsNavbar є в схемі але повертає null — збережіть Navbar options у WP Admin';
        } else {
            $cta   = $navbar['navCtaText'] ?? '(empty)';
            $links = count( $navbar['navLinks'] ?? [] );
            $log[] = "  ✅ Navbar options OK — CTA: \"{$cta}\", links: {$links}";
        }
    }

    // ── 9. Footer Options ───────────────────────────────────────────────────
    [ $ok, $data ] = $query( '{ acfOptionsFooter { footer { footerEmail footerCopyright footerMenuLinks { label } } } }' );
    if ( ! $ok ) {
        $log[] = "  ❌ Footer options: {$data}";
        $log[] = '     → Перевір: WPGraphQL for ACF активний, Options Pages зареєстровані (theme-setup.php)';
    } else {
        $footer = $data['acfOptionsFooter']['footer'] ?? null;
        if ( ! $footer ) {
            $log[] = '  ⚠ Footer: acfOptionsFooter є в схемі але повертає null — збережіть Footer options у WP Admin';
        } else {
            $email = $footer['footerEmail'] ?? '(empty)';
            $links = count( $footer['footerMenuLinks'] ?? [] );
            $log[] = "  ✅ Footer options OK — email: \"{$email}\", menu links: {$links}";
        }
    }

    // ── 10. Block Attributes (Hero block) ───────────────────────────────────
    $log[] = '';
    $log[] = '5. Block Attributes (Hero on Home)';
    // New flat schema: racqueteerHero { title ... } directly on block (no attributes wrapper)
    [ $ok, $data ] = $query( '{ pageBy(uri:"/") { blocks { __typename ... on AcfRacqueteerHeroBlock { racqueteerHero { title ctaPrimaryText videoUrl } } } } }' );
    if ( ! $ok ) {
        $err = (string) $data;
        if ( strpos( $err, 'cannot be spread' ) !== false || strpos( $err, 'can never be of type' ) !== false ) {
            $log[] = '  ❌ Hero block query failed: AcfRacqueteerHeroBlock does NOT implement Block interface';
            $log[] = '     → Deploy graphql-extensions.php v18 (Strategy G: pre-register Block at priority 1)';
        } else {
            $log[] = "  ❌ Hero block query failed: {$data}";
        }
        $ok = false;
    }
    if ( $ok ) {
        $blocks = $data['pageBy']['blocks'] ?? [];
        $hero   = null;
        foreach ( $blocks as $b ) {
            if ( ( $b['__typename'] ?? '' ) === 'AcfRacqueteerHeroBlock' ) {
                $hero = $b;
                break;
            }
        }
        if ( ! $hero ) {
            $block_types = array_column( $blocks, '__typename' );
            $log[] = '  ⚠ AcfRacqueteerHeroBlock not found on Home page';
            $log[] = '     Found block types: ' . ( $block_types ? implode( ', ', $block_types ) : '(none — Page.blocks empty)' );
            if ( empty( $block_types ) ) {
                $log[] = '     → Block interface implemented (query worked!) but no blocks returned';
                $log[] = '     → WPGraphQL Content Blocks may not recognize acf/ block names. Run Import again.';
            }
        } else {
            // New flat schema: racqueteerHero is directly on the block
            $attrs = $hero['racqueteerHero'] ?? [];
            if ( empty( $attrs['title'] ) ) {
                $log[] = '  ⚠ Hero block found but racqueteerHero.title is empty — ACF inline data not read';
                $log[] = '     Keys on hero block: ' . implode( ', ', array_keys( $hero ) );
            } else {
                $log[] = "  ✅ Hero attributes OK — title: \"" . mb_substr( $attrs['title'], 0, 50 ) . '"';
                $log[] = "  ✅ CTA: \"{$attrs['ctaPrimaryText']}\"";
                $log[] = "  ✅ Video: \"{$attrs['videoUrl']}\"";
            }
        }
    }

    $log[] = '';
    $log[] = str_repeat( '─', 50 );
    $errors = count( array_filter( $log, fn( $l ) => str_contains( $l, '❌' ) ) );
    $warns  = count( array_filter( $log, fn( $l ) => str_contains( $l, '⚠' ) ) );
    $log[]  = $errors === 0 && $warns === 0
        ? '🎉 All checks passed!'
        : "Summary: {$errors} errors, {$warns} warnings — перевір деталі вище";

    return $log;
}

// ─────────────────────────────────────────────
// WP + WPGraphQL SETTINGS AUTO-CONFIGURATION
// ─────────────────────────────────────────────

function rq_configure_wp_settings( array &$log ): void {

    // 1. Permalink structure → /%postname%/
    //    КРИТИЧНО: без цього pageBy(uri:"/") у WPGraphQL не працює
    $permalink = get_option( 'permalink_structure' );
    if ( $permalink !== '/%postname%/' ) {
        update_option( 'permalink_structure', '/%postname%/' );
        flush_rewrite_rules( true );
        $log[] = "  ✔ Permalinks → /%postname%/ (rewrite rules flushed)";
    } else {
        $log[] = "  ✔ Permalinks already /%postname%/";
    }

    // 2. WPGraphQL — увімкнути introspection та batch queries
    if ( defined( 'WPGRAPHQL_VERSION' ) || function_exists( 'graphql' ) ) {
        $gql = get_option( 'graphql_general_settings', [] );
        // get_option може повернути false або рядок — нормалізуємо до масиву
        if ( ! is_array( $gql ) ) {
            $gql = [];
        }
        $gql['public_introspection_enabled'] = 'on';
        $gql['batch_queries_enabled']        = 'on';
        $gql['query_depth_enabled']          = 'off';
        $gql['tracing_enabled']              = 'off';
        update_option( 'graphql_general_settings', $gql );
        $log[] = "  ✔ WPGraphQL: introspection=on, batch=on, depth-limit=off";
    } else {
        $log[] = "  ⚠ WPGraphQL not detected — install & activate the plugin!";
    }

    // 3. ACF Pro — перевірка
    if ( class_exists( 'ACF' ) ) {
        $log[] = "  ✔ ACF Pro detected (version " . ( defined( 'ACF_VERSION' ) ? ACF_VERSION : '?' ) . ")";
    } else {
        $log[] = "  ⚠ ACF Pro not detected — install & activate ACF Pro!";
    }

    // 4. WPGraphQL for ACF — перевірка
    if ( function_exists( 'wpgraphql_acf' ) || defined( 'WPGRAPHQL_FOR_ACF_VERSION' ) ) {
        $log[] = "  ✔ WPGraphQL for ACF detected";
    } else {
        $log[] = "  ⚠ WPGraphQL for ACF not detected — install & activate it!";
    }

    // 5. WPGraphQL Content Blocks — потрібен для поля blocks на сторінках
    if ( rq_detect_content_blocks_plugin() ) {
        $ver   = defined( 'WPGRAPHQL_CONTENT_BLOCKS_VERSION' ) ? WPGRAPHQL_CONTENT_BLOCKS_VERSION : 'active';
        $log[] = "  ✔ WPGraphQL Content Blocks detected (v{$ver})";
    } else {
        $log[] = "  ⚠ WPGraphQL Content Blocks NOT detected — потрібен для блоків у GraphQL! Встанови плагін: WPGraphQL Content Blocks";
    }

    // 5. Timezone та формат дати (Sydney)
    update_option( 'timezone_string', 'Australia/Sydney' );
    update_option( 'date_format',     'M j, Y'           );
    update_option( 'time_format',     'g:i a'            );
    $log[] = "  ✔ Timezone → Australia/Sydney, date format → M j, Y";

    // 6. Вимкнути коментарі (headless — не потрібно)
    update_option( 'default_comment_status', 'closed' );
    update_option( 'default_ping_status',    'closed' );
    $log[] = "  ✔ Comments disabled (headless mode)";

    // 7. Налаштування блогу — назва сайту
    if ( get_option( 'blogname' ) === 'My WordPress Website' || get_option( 'blogname' ) === '' ) {
        update_option( 'blogname',        'Racqueteer' );
        update_option( 'blogdescription', 'Premier Pickleball & Padel Club in Sydney' );
        $log[] = "  ✔ Site title → Racqueteer";
    }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Serialize a single ACF Gutenberg block (stores data inline in block comment).
 *
 * Includes a unique block ID — required by ACF so that acf_setup_meta()
 * can correctly set up the field context when WPGraphQL resolves block fields.
 */
function rq_acf_block( string $block_name, array $data ): string {
    // Generate a stable, unique block ID (same format as ACF uses internally)
    $block_id = 'block_' . substr( md5( $block_name . wp_json_encode( array_filter( $data, fn( $v, $k ) => strpos( $k, '_' ) !== 0, ARRAY_FILTER_USE_BOTH ) ) ), 0, 13 );

    $attrs = [
        'id'   => $block_id,
        'name' => $block_name,
        'data' => $data,
        'mode' => 'preview',
    ];
    return '<!-- wp:' . $block_name . ' ' . wp_json_encode( $attrs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ' /-->' . "\n";
}

/**
 * Find or create a page by slug. Returns post ID.
 *
 * Saves Gutenberg block comment markup (<!-- wp:acf/... -->) correctly:
 * - Does NOT call wp_slash() — modern WordPress expects unslashed data in
 *   wp_insert_post/wp_update_post; pre-slashing causes double-escaped JSON
 *   in block attributes when WPDB applies its own SQL escaping.
 * - Temporarily removes the KSES content filter to prevent block comments
 *   from being stripped on sites where the current user lacks unfiltered_html.
 */
function rq_upsert_page( string $title, string $slug, string $content ): int {
    $existing = get_page_by_path( $slug );

    $args = [
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_content' => $content, // raw, no wp_slash — db escaping is handled by WPDB internally
        'post_status'  => 'publish',
        'post_type'    => 'page',
    ];

    // Bypass KSES content filter so Gutenberg block comments are not stripped.
    // The filter is only active for users without the unfiltered_html capability
    // (e.g. multisite admins), but we remove / restore it unconditionally for safety.
    $had_save    = has_filter( 'content_save_pre',          'wp_filter_post_kses' );
    $had_filtered = has_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
    remove_filter( 'content_save_pre',          'wp_filter_post_kses' );
    remove_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );

    if ( $existing ) {
        $args['ID'] = $existing->ID;
        wp_update_post( $args );
        $id = $existing->ID;
    } else {
        $id = wp_insert_post( $args );
        $id = is_wp_error( $id ) ? 0 : (int) $id;
    }

    // Restore KSES filters
    if ( $had_save ) {
        add_filter( 'content_save_pre', 'wp_filter_post_kses' );
    }
    if ( $had_filtered ) {
        add_filter( 'content_filtered_save_pre', 'wp_filter_post_kses' );
    }

    return (int) $id;
}

/**
 * Find or create a CPT post by title. Returns post ID.
 */
function rq_upsert_cpt( string $post_type, string $title, array $acf_data = [] ): int {
    $existing = get_posts( [
        'post_type'      => $post_type,
        'post_status'    => 'publish',
        'title'          => $title,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ] );

    $args = [
        'post_title'  => $title,
        'post_status' => 'publish',
        'post_type'   => $post_type,
    ];

    if ( $existing ) {
        $args['ID'] = $existing[0];
        wp_update_post( $args );
        $post_id = $existing[0];
    } else {
        $post_id = wp_insert_post( $args );
    }

    if ( $post_id && ! is_wp_error( $post_id ) && function_exists( 'update_field' ) ) {
        foreach ( $acf_data as $field_key => $value ) {
            update_field( $field_key, $value, $post_id );
        }
    }

    return is_wp_error( $post_id ) ? 0 : (int) $post_id;
}

/**
 * Sideload an image from a LOCAL file path → WP Media Library.
 * Copies file to a temp location so WP can safely "move" it.
 * Caches by absolute path.
 */
function rq_sideload_local_image( string $local_path, string $title = '' ): int {
    $cache_key = 'rq_media_local_' . md5( $local_path );
    $cached    = (int) get_option( $cache_key, 0 );
    if ( $cached && get_post( $cached ) ) {
        return $cached;
    }

    if ( ! file_exists( $local_path ) ) {
        return 0;
    }

    // Copy to a real temp file (WP will move/rename it — we don't want to lose the original)
    $tmp = wp_tempnam( basename( $local_path ) );
    if ( ! @copy( $local_path, $tmp ) ) {
        return 0;
    }

    $file_array = [
        'name'     => $title ? ( $title . '.' . pathinfo( $local_path, PATHINFO_EXTENSION ) ) : basename( $local_path ),
        'tmp_name' => $tmp,
    ];

    $id = media_handle_sideload( $file_array, 0, $title ?: basename( $local_path ) );
    @unlink( $tmp );

    if ( is_wp_error( $id ) ) {
        return 0;
    }

    update_option( $cache_key, (int) $id );
    return (int) $id;
}

/**
 * Sideload an image from URL → WP Media Library. Caches by URL.
 */
function rq_sideload_image( string $url, string $title = '' ): int {
    $cache_key = 'rq_media_' . md5( $url );
    $cached    = (int) get_option( $cache_key, 0 );
    if ( $cached && get_post( $cached ) ) {
        return $cached;
    }

    $tmp = download_url( $url, 15 );
    if ( is_wp_error( $tmp ) ) {
        return 0;
    }

    $file_array = [
        'name'     => $title ?: basename( (string) parse_url( $url, PHP_URL_PATH ) ),
        'tmp_name' => $tmp,
    ];

    $id = media_handle_sideload( $file_array, 0, $title );
    @unlink( $tmp );

    if ( is_wp_error( $id ) ) {
        return 0;
    }

    update_option( $cache_key, (int) $id );
    return (int) $id;
}

/**
 * Try local theme asset first, fall back to remote URL.
 * Local assets live in: wp/assets/images/
 */
function rq_sideload_asset( string $filename, string $remote_url, string $title = '' ): int {
    $local_path = RACQUETEER_DIR . '/assets/images/' . $filename;
    if ( file_exists( $local_path ) ) {
        return rq_sideload_local_image( $local_path, $title );
    }
    return rq_sideload_image( $remote_url, $title );
}

// ─────────────────────────────────────────────
// MEDIA
// ─────────────────────────────────────────────

function rq_import_media( string $nextjs, array &$log ): array {
    // [ key => [ filename_in_assets_images, remote_fallback_url ] ]
    $assets = [
        'logo'                  => [ 'logo2.svg',                       $nextjs . 'logo2.svg'                       ],
        'logo_icon'             => [ 'logo-icon.png',                   $nextjs . 'logo-icon.png'                   ],
        'racket_pickleball'     => [ 'racket-pickleball.png',           $nextjs . 'racket-pickleball.png'           ],
        'racket_padel'          => [ 'racket-padel.png',                $nextjs . 'racket-padel.png'                ],
        'rackets_mobile'        => [ 'rackets-mobile.png',              $nextjs . 'rackets-mobile.png'              ],
        'membership_bg'         => [ 'membership-bg.png',               $nextjs . 'membership-bg.png'               ],
        'membership_pickleball' => [ 'membership-racket-pickleball.png',$nextjs . 'membership-racket-pickleball.png'],
        'membership_padel'      => [ 'membership-racket-padel.png',     $nextjs . 'membership-racket-padel.png'     ],
        'about_hero'            => [ 'about-hero.png',                  $nextjs . 'about-hero.png'                  ],
        'contact_bg'            => [ 'contact-bg.png',                  $nextjs . 'contact-bg.png'                  ],
    ];

    $media = [];
    foreach ( $assets as $key => [ $filename, $remote_url ] ) {
        $local_path = RACQUETEER_DIR . '/assets/images/' . $filename;
        $source     = file_exists( $local_path ) ? "local:{$filename}" : $remote_url;

        $id = rq_sideload_asset( $filename, $remote_url, $key );
        if ( $id ) {
            $media[ $key ] = $id;
            $log[] = "  ✔ Media: {$key} (ID {$id}) [{$source}]";
        } else {
            $media[ $key ] = 0;
            $log[] = "  ⚠ Media skipped: {$filename} (no local file & remote unreachable)";
        }
    }
    return $media;
}

// ─────────────────────────────────────────────
// CPT: JOBS
// ─────────────────────────────────────────────

function rq_create_jobs( array &$log ): void {
    $jobs = [
        [ 'Club Manager',         'Lead daily operations, manage staff scheduling, oversee member relations, and ensure an exceptional experience across all club facilities.',        'Manager', ],
        [ 'Assistant Manager',    'Support the Club Manager in daily operations, coordinate events, handle member inquiries, and step in as acting manager when needed.',              'Manager', ],
        [ 'Head Pickleball Coach','Design and lead pickleball training programs for all skill levels. Conduct private lessons, group clinics, and competitive development sessions.',  'Trainer', ],
        [ 'Padel Trainer',        'Deliver high-energy padel coaching sessions, develop player technique, and help grow the padel community at the club through engaging programs.',   'Trainer', ],
        [ 'Youth Program Coach',  'Run junior development programs, create age-appropriate training plans, and build a fun and encouraging environment for young players.',            'Trainer', ],
        [ 'Lead Barista',         'Manage the club café, craft specialty coffee and drinks, maintain quality standards, and train new barista team members.',                          'Barista', ],
        [ 'Barista',              'Prepare and serve premium beverages, maintain a clean and welcoming café space, and provide excellent customer service to members and guests.',     'Barista', ],
        [ 'Front Desk Associate', 'Welcome members and guests, handle court bookings, answer questions, and ensure smooth check-in and check-out experiences daily.',                 'Manager', ],
    ];

    foreach ( $jobs as [ $title, $desc, $cat ] ) {
        $id = rq_upsert_cpt( 'job', $title, [
            'field_job_description' => $desc,
            'field_job_category'    => $cat,
        ] );
        $log[] = "  ✔ Job: {$title} (ID {$id})";
    }
}

// ─────────────────────────────────────────────
// CPT: TESTIMONIALS
// ─────────────────────────────────────────────

function rq_create_testimonials( array &$log ): void {
    $items = [
        [ 'Martin Goutry — Beginner',    '"The training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I\'m excited to come back and keep improving!"',                                                       'Beginner Training',      5.0, 5.0, 'Martin Goutry',   'Beginner Training',      ],
        [ 'Sarah Chen — Advanced',        '"Incredible coaching and a very supportive environment. The drills were intense but effective. My serve has improved tremendously since joining. Highly recommend to anyone serious about the sport!"',                                       'Advanced Training',      5.0, 5.0, 'Sarah Chen',       'Advanced Training',      ],
        [ 'James Okafor — Intermediate',  '"Exactly what I needed to level up my game. The coaches are attentive and the class sizes are perfect. I feel a genuine improvement after every session."',                                                                                 'Intermediate Training',  5.0, 5.0, 'James Okafor',     'Intermediate Training',  ],
        [ 'Emily Rodriguez — Beginner',   '"As someone who\'d never played before, I was nervous walking in. The instructors made it so welcoming and fun. Now I\'m hooked and I play every week!"',                                                                                   'Beginner Training',      5.0, 5.0, 'Emily Rodriguez',  'Beginner Training',      ],
        [ 'Lisa Park — Advanced',         '"The advanced clinics pushed my game to new heights. The coaching staff are incredibly knowledgeable and the facilities are world class. Best decision I\'ve made!"',                                                                        'Advanced Training',      5.0, 5.0, 'Lisa Park',        'Advanced Training',      ],
        [ 'Tom Walker — Intermediate',    '"Fantastic community, brilliant coaches. The intermediate program gave me exactly the structured practice I needed. Can\'t recommend Racqueteer enough!"',                                                                                   'Intermediate Training',  5.0, 5.0, 'Tom Walker',       'Intermediate Training',  ],
    ];

    foreach ( $items as [ $post_title, $quote, $category, $rating, $maxRating, $authorName, $authorSubtitle ] ) {
        $id = rq_upsert_cpt( 'testimonial', $post_title, [
            'field_test_category'        => $category,
            'field_test_rating'          => $rating,
            'field_test_max_rating'      => $maxRating,
            'field_test_quote'           => $quote,
            'field_test_author_name'     => $authorName,
            'field_test_author_subtitle' => $authorSubtitle,
        ] );
        $log[] = "  ✔ Testimonial: {$authorName} (ID {$id})";
    }
}

// ─────────────────────────────────────────────
// CPT: LOCATIONS
// ─────────────────────────────────────────────

function rq_create_locations( array $media, array &$log ): void {
    $locations = [
        [
            'Homebush Club', 'available',
            [ 'Homebush, Sydney', 'New South Wales 2140, Australia' ],
            'Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.',
        ],
        [
            'Alexandria Club', 'coming_soon',
            [ 'Alexandria, Sydney', 'New South Wales 2015, Australia' ],
            'Our newest location coming soon to Alexandria. A world-class facility designed for serious players and casual enthusiasts alike.',
        ],
    ];

    foreach ( $locations as [ $title, $status, $address, $desc ] ) {
        $acf = [
            'field_loc_location_id'     => sanitize_title( $title ),
            'field_loc_name'            => $title,
            'field_loc_status'          => $status,
            // address: textarea — one line per row, frontend splits on "\n"
            'field_loc_address'         => implode( "\n", $address ),
            // field_cpt_loc_description avoids key conflict with racqueteer-locations block
            'field_cpt_loc_description' => $desc,
        ];
        if ( ! empty( $media['about_hero'] ) ) {
            $acf['field_loc_image'] = $media['about_hero'];
        }
        $id = rq_upsert_cpt( 'location', $title, $acf );
        $log[] = "  ✔ Location: {$title} (ID {$id})";
    }
}

// ─────────────────────────────────────────────
// CPT: PROGRAMS
// ─────────────────────────────────────────────

function rq_create_programs( array &$log ): void {
    $programs = [
        [ "Women's Beginners",   'red',  '$40', 'per game', "This introductory session is the perfect way to get started! We'll cover the basics of the game, from the rules and scoring to essential techniques like grip, positioning, and basic shots." ],
        [ 'Mens Beginner',       'blue', '$40', 'per game', "Join our fun and supportive group clinic designed specifically for beginners! Whether you're new to padel or just starting to play, this clinic will help you master the fundamentals." ],
        [ 'Group Beginner',      'red',  '$60', 'per game', "Take your padel skills to the next level in our intermediate clinic! Perfect for those who already know the basics, this clinic focuses on refining your technique and improving shot placement." ],
        [ "Women's Intermediate",'blue', '$80', 'per game', "This clinic is designed for top players looking to perfect their game. Focus will be on very advanced techniques, precision, and strategic play with complex shot combinations." ],
    ];

    foreach ( $programs as [ $title, $color, $price, $unit, $desc ] ) {
        $id = rq_upsert_cpt( 'program', $title, [
            // field_cpt_prog_title / field_cpt_prog_description avoid key conflicts
            // with the racqueteer-programs BLOCK fields (field_prog_title / field_prog_description).
            'field_cpt_prog_title'       => $title,
            'field_prog_color'           => $color,
            'field_prog_price'           => $price,
            'field_prog_unit'            => $unit,
            'field_cpt_prog_description' => $desc,
        ] );
        $log[] = "  ✔ Program: {$title} (ID {$id})";
    }
}

// ─────────────────────────────────────────────
// CPT: MEMBERSHIP PLANS
// ─────────────────────────────────────────────

function rq_create_membership_plans( array &$log ): void {
    $plans = [
        [ 'STARTER', 'Perfect for getting started',       '$89',  'blue', 'bg-[#F4F6F9]', 'border-[#E5E7EB]', false, 'check,check,check,cross,cross,cross,cross,0,2 days'  ],
        [ 'LIGHT',   'Great choice to begin your journey', '$135', 'blue', 'bg-white',     'border-[#E5E7EB]', false, 'check,check,check,check,check,cross,cross,4,4 days'  ],
        [ 'PRO',     'Ideal for launching your experience','$189', 'red',  'bg-white',     'border-[#E5E7EB]', true,  'check,check,check,check,check,check,cross,10,7 days' ],
        [ 'PRO+',    'Best suited for serious players',    '$397', 'red',  'bg-white',     'border-[#E5E7EB]', false, 'check,check,check,check,check,check,check,12,14 days'],
    ];

    foreach ( $plans as [ $title, $desc, $price, $btnVariant, $bgClass, $borderClass, $hasImage, $values ] ) {
        $id = rq_upsert_cpt( 'membership', $title, [
            'field_mem_description'    => $desc,
            'field_mem_price'          => $price,
            'field_mem_button_variant' => $btnVariant,
            'field_mem_bg_class'       => $bgClass,
            'field_mem_border_class'   => $borderClass,
            'field_mem_has_image'      => $hasImage ? '1' : '0',
            'field_mem_values'         => $values,
        ] );
        $log[] = "  ✔ Membership plan: {$title} (ID {$id})";
    }
}

// ─────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────

function rq_create_page_home( string $nextjs, array $media, array &$log ): void {
    $content  = rq_acf_block( 'acf/racqueteer-hero', [
        'title'               => 'Where Elite Competition Meets a Refined Social Atmosphere',
        '_title'              => 'field_hero_title',
        'description'         => 'Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.',
        '_description'        => 'field_hero_description',
        'cta_primary_text'    => 'Book a Court',
        '_cta_primary_text'   => 'field_hero_cta_primary_text',
        'cta_primary_url'     => '#',
        '_cta_primary_url'    => 'field_hero_cta_primary_url',
        'cta_secondary_text'  => 'Become a Member',
        '_cta_secondary_text' => 'field_hero_cta_secondary_text',
        'cta_secondary_url'   => '/memberships',
        '_cta_secondary_url'  => 'field_hero_cta_secondary_url',
        'video_url'           => $nextjs . 'hero-video.mp4',
        '_video_url'          => 'field_hero_video',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-about', [
        'label'         => 'about racqueteer',
        '_label'        => 'field_about_label',
        'title'         => 'The Ultimate Destination for Padel & Pickleball Players',
        '_title'        => 'field_about_title',
        'description'   => 'Racqueteer is more than just a place to play — it\'s a hub for the fast-growing world of padel and pickleball. Designed for players of all levels, our club combines professional courts, a welcoming community, and world-class facilities.',
        '_description'  => 'field_about_description',
        'stat1_number'  => '25',
        '_stat1_number' => 'field_about_stat1_num',
        'stat1_label'   => 'Courts of Art',
        '_stat1_label'  => 'field_about_stat1_lbl',
        'stat2_number'  => '8+',
        '_stat2_number' => 'field_about_stat2_num',
        'stat2_label'   => 'Years of Experience',
        '_stat2_label'  => 'field_about_stat2_lbl',
        'left_image'    => $media['racket_pickleball'] ?: ( $nextjs . 'racket-pickleball.png' ),
        '_left_image'   => 'field_about_left_image',
        'right_image'   => $media['racket_padel'] ?: ( $nextjs . 'racket-padel.png' ),
        '_right_image'  => 'field_about_right_image',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-locations', [
        'label'        => 'locations',
        '_label'       => 'field_loc_label',
        'title'        => 'Play at Your Favorite Location',
        '_title'       => 'field_loc_title',
        'description'  => 'With multiple state-of-the-art locations across Sydney, we make it easy to find a club near you.',
        '_description' => 'field_loc_description',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-programs', [
        'label'        => 'programming',
        '_label'       => 'field_prog_label',
        'title'        => 'Find the Perfect Program for You',
        '_title'       => 'field_prog_title',
        'description'  => 'Whether you\'re a complete beginner or an advanced player, we have programs tailored to your skill level and goals.',
        '_description' => 'field_prog_description',
        'tabs'         => 'Programming,Coaching,Events',
        '_tabs'        => 'field_prog_tabs',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-subscriptions', [
        'label'        => 'memberships',
        '_label'       => 'field_subs_label',
        'title'        => 'Choose Your Perfect Membership Plan',
        '_title'       => 'field_subs_title',
        'description'  => 'Select the plan that best fits your lifestyle and playing frequency. All memberships include access to our world-class facilities, expert coaching, and vibrant community.',
        '_description' => 'field_subs_description',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-testimonials', [
        'label'        => 'testimonials',
        '_label'       => 'field_test_label',
        'title'        => 'What Our Members Say',
        '_title'       => 'field_test_title',
        'description'  => 'Hear from our community of passionate players who have made Racqueteer their home court.',
        '_description' => 'field_test_description',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-events', [
        'title'        => 'Join Our Next Tournament or Social Event',
        '_title'       => 'field_events_title',
        'description'  => 'From competitive tournaments to casual social mixers, there\'s always something happening at Racqueteer.',
        '_description' => 'field_events_description',
        'cta_text'     => 'View Events Calendar',
        '_cta_text'    => 'field_events_cta_text',
        'cta_url'      => '#',
        '_cta_url'     => 'field_events_cta_url',
        'image'        => $media['about_hero'] ?? '',
        '_image'       => 'field_events_image',
    ] );

    $page_id = rq_upsert_page( 'Home', 'home', $content );
    update_option( 'show_on_front', 'page' );
    update_option( 'page_on_front', $page_id );
    $log[] = "  ✔ Page: Home (ID {$page_id}) — set as front page";
}

function rq_create_page_memberships( string $nextjs, array $media, array &$log ): void {
    $content  = rq_acf_block( 'acf/racqueteer-membership-hero', [
        'label'           => 'membership',
        '_label'          => 'field_mhero_label',
        'title'           => 'Become a Member',
        '_title'          => 'field_mhero_title',
        'description'     => 'We are thrilled to have you consider becoming a part of our community.',
        '_description'    => 'field_mhero_description',
        'price_starting'  => '$89',
        '_price_starting' => 'field_mhero_price_starting',
        'price_unit'      => '/month',
        '_price_unit'     => 'field_mhero_price_unit',
        'cta_text'        => 'View Plans',
        '_cta_text'       => 'field_mhero_cta_text',
        'video_url'       => $nextjs . 'private-events-hero.mp4',
        '_video_url'      => 'field_mhero_video',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-subscriptions-detail', [
        'label'        => 'memberships',
        '_label'       => 'field_subsd_label',
        'title'        => 'Choose Your Perfect Membership Plan',
        '_title'       => 'field_subsd_title',
        'description'  => 'Select the plan that best fits your lifestyle and playing frequency. All memberships include access to our world-class facilities.',
        '_description' => 'field_subsd_description',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-price-compare', [
        'label'        => 'compare plans',
        '_label'       => 'field_pc_label',
        'title'        => 'Compare Membership Features',
        '_title'       => 'field_pc_title',
        'description'  => 'See all the benefits side-by-side to help you choose the right membership level.',
        '_description' => 'field_pc_description',
    ] );

    $page_id = rq_upsert_page( 'Memberships', 'memberships', $content );
    $log[] = "  ✔ Page: Memberships (ID {$page_id})";
}

function rq_create_page_private_events( string $nextjs, array $media, array &$log ): void {
    $content  = rq_acf_block( 'acf/racqueteer-private-events-hero', [
        'label'        => 'private events',
        '_label'       => 'field_pehero_label',
        'title'        => 'Host Your Event at Racqueteer',
        '_title'       => 'field_pehero_title',
        'description'  => 'From corporate team-building to birthday parties and tournaments, our premium facilities provide the perfect backdrop for any occasion.',
        '_description' => 'field_pehero_description',
        'cta_text'     => 'Enquire Now',
        '_cta_text'    => 'field_pehero_cta_text',
        'cta_url'      => 'mailto:info.racqueteer.club@gmail.com',
        '_cta_url'     => 'field_pehero_cta_url',
        'video_url'    => $nextjs . 'private-events-hero-new.mp4',
        '_video_url'   => 'field_pehero_video',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-gallery', [
        'label'        => 'our facilities',
        '_label'       => 'field_gal_label',
        'title'        => 'World-Class Venues for Memorable Events',
        '_title'       => 'field_gal_title',
        'description'  => 'Explore our stunning courts, lounges, and event spaces designed to accommodate groups of all sizes.',
        '_description' => 'field_gal_description',
        'images'       => [],
        '_images'      => 'field_gal_images',
    ] );

    $logo_ids = [];
    for ( $i = 1; $i <= 8; $i++ ) {
        $filename = "logo{$i}.svg";
        $logo_id  = rq_sideload_asset( $filename, $nextjs . $filename, "Partner Logo {$i}" );
        if ( $logo_id ) {
            $logo_ids[] = $logo_id;
        }
    }

    $content .= rq_acf_block( 'acf/racqueteer-logo-marquee', [
        'label'   => 'trusted by',
        '_label'  => 'field_logo_label',
        'title'   => 'Corporate Partners Who\'ve Hosted with Us',
        '_title'  => 'field_logo_title',
        'logos'   => $logo_ids,
        '_logos'  => 'field_logo_logos',
    ] );

    $page_id = rq_upsert_page( 'Private Events', 'private-events', $content );
    $log[] = "  ✔ Page: Private Events (ID {$page_id})";
}

function rq_create_page_about( string $nextjs, array $media, array &$log ): void {
    $content  = rq_acf_block( 'acf/racqueteer-about-hero', [
        'label'        => 'about us',
        '_label'       => 'field_ahero_label',
        'title'        => 'Bringing People Together Through Racquet Sports',
        '_title'       => 'field_ahero_title',
        'description'  => 'Racqueteer was founded on a simple belief: racquet sports should be accessible, enjoyable, and community-driven. We\'ve built more than courts — we\'ve built a movement.',
        '_description' => 'field_ahero_description',
        'video_url'    => $nextjs . 'private-events-hero.mp4',
        '_video_url'   => 'field_ahero_video',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-mission', [
        'label'        => 'our mission',
        '_label'       => 'field_miss_label',
        'title'        => 'Creating Spaces Where Players Thrive',
        '_title'       => 'field_miss_title',
        'description'  => 'We\'re committed to providing world-class facilities, expert coaching, and a welcoming environment where players of all levels can improve, connect, and have fun.',
        '_description' => 'field_miss_description',
        'image'        => $media['about_hero'] ?? '',
        '_image'       => 'field_miss_image',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-locations', [
        'label'        => 'locations',
        '_label'       => 'field_loc_label',
        'title'        => 'Find Us Near You',
        '_title'       => 'field_loc_title',
        'description'  => 'With multiple state-of-the-art locations across Sydney, we make it easy to find a club near you.',
        '_description' => 'field_loc_description',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-contact', [
        'label'        => 'get in touch',
        '_label'       => 'field_cont_label',
        'title'        => 'Have Questions? We\'re Here to Help',
        '_title'       => 'field_cont_title',
        'description'  => 'Whether you\'re interested in membership, hosting an event, or just want to learn more about Racqueteer, our team is ready to assist you.',
        '_description' => 'field_cont_description',
        'email'        => 'info.racqueteer.club@gmail.com',
        '_email'       => 'field_cont_email',
        'phone'        => '+61 4 8123 4567',
        '_phone'       => 'field_cont_phone',
        'cta_text'     => 'Send a Message',
        '_cta_text'    => 'field_cont_cta_text',
        'cta_url'      => 'mailto:info.racqueteer.club@gmail.com',
        '_cta_url'     => 'field_cont_cta_url',
    ] );

    $page_id = rq_upsert_page( 'About', 'about', $content );
    $log[] = "  ✔ Page: About (ID {$page_id})";
}

function rq_create_page_careers( string $nextjs, array $media, array &$log ): void {
    $content  = rq_acf_block( 'acf/racqueteer-careers-hero', [
        'label'        => 'careers',
        '_label'       => 'field_chero_label',
        'title'        => 'Join Our Team',
        '_title'       => 'field_chero_title',
        'description'  => 'Be part of something bigger. At Racqueteer, we\'re building a community of passionate individuals who love racquet sports and creating exceptional experiences.',
        '_description' => 'field_chero_description',
        'video_url'    => $nextjs . 'careers-hero.mp4',
        '_video_url'   => 'field_chero_video',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-job-listings', [
        'label'        => 'open positions',
        '_label'       => 'field_jobs_label',
        'title'        => 'Current Opportunities',
        '_title'       => 'field_jobs_title',
        'description'  => 'Explore our available roles and find the perfect fit for your skills and passion.',
        '_description' => 'field_jobs_description',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-career-contact', [
        'label'        => "don't see a fit?",
        '_label'       => 'field_cc_label',
        'title'        => 'We\'re Always Looking for Talent',
        '_title'       => 'field_cc_title',
        'description'  => 'Even if there\'s no open position that matches your skills right now, we\'d love to hear from you. Send us your resume and we\'ll keep you in mind for future opportunities.',
        '_description' => 'field_cc_description',
        'cta_text'     => 'Send Your Resume',
        '_cta_text'    => 'field_cc_cta_text',
        'cta_url'      => 'mailto:careers@racqueteer.club',
        '_cta_url'     => 'field_cc_cta_url',
        'image'        => $media['about_hero'] ?? '',
        '_image'       => 'field_cc_image',
    ] );

    $page_id = rq_upsert_page( 'Careers', 'careers', $content );
    $log[] = "  ✔ Page: Careers (ID {$page_id})";
}

// ─────────────────────────────────────────────
// ACF OPTIONS: Navbar + Footer
// ─────────────────────────────────────────────

function rq_set_site_options( array $media, array &$log ): void {
    if ( ! function_exists( 'update_field' ) ) {
        $log[] = '  ⚠ ACF not active — skipping Options fields';
        return;
    }

    $logo_id      = $media['logo']      ?? 0;
    $logo_icon_id = $media['logo_icon'] ?? 0;

    update_field( 'field_nav_logo',      $logo_id,       'options' );
    update_field( 'field_nav_logo_icon', $logo_icon_id,  'options' );
    update_field( 'field_nav_cta_text',  'Book a Court', 'options' );
    update_field( 'field_nav_cta_url',   '#',            'options' );
    update_field( 'field_nav_links', [
        [ 'label' => 'Home',              'url' => '/'               ],
        [ 'label' => 'Coaching',          'url' => '#'               ],
        [ 'label' => 'Events & Programs', 'url' => '#'               ],
        [ 'label' => 'Membership',        'url' => '/memberships'    ],
        [ 'label' => 'Private Events',    'url' => '/private-events' ],
        [ 'label' => 'About Us',          'url' => '/about'          ],
        [ 'label' => 'Careers',           'url' => '/careers'        ],
    ], 'options' );
    $log[] = '  ✔ Navbar options saved';

    update_field( 'field_footer_logo',        $logo_id,                           'options' );
    update_field( 'field_footer_email',        'info.racqueteer.club@gmail.com',   'options' );
    update_field( 'field_footer_phone',        '+61 4 8123 4567',                  'options' );
    update_field( 'field_footer_cta_text',     'Book a Court',                     'options' );
    update_field( 'field_footer_cta_url',      '#',                                'options' );
    update_field( 'field_footer_menu_links', [
        [ 'label' => 'Membership',      'url' => '/memberships'    ],
        [ 'label' => 'Events',          'url' => '#'               ],
        [ 'label' => 'Private Events',  'url' => '/private-events' ],
        [ 'label' => 'Coaching',        'url' => '#'               ],
        [ 'label' => 'About Us',        'url' => '/about'          ],
        [ 'label' => 'Careers',         'url' => '/careers'        ],
    ], 'options' );
    update_field( 'field_footer_locations', [
        [ 'name' => 'Homebush Club',   'address' => 'Homebush, Sydney. New South Wales 2140, Australia' ],
        [ 'name' => 'Alexandria Club', 'address' => 'Alexandria, Sydney. Australia'                     ],
    ], 'options' );
    update_field( 'field_footer_copyright',    '©2026 Racqueteer. All Rights Reserved.', 'options' );
    update_field( 'field_footer_legal_links', [
        [ 'label' => 'Conditions',       'url' => '#' ],
        [ 'label' => 'Terms of Service', 'url' => '#' ],
        [ 'label' => 'Privacy Policy',   'url' => '#' ],
    ], 'options' );
    $log[] = '  ✔ Footer options saved';
}

