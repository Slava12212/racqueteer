<?php
/**
 * Content Exporter
 *
 * Reads all current ACF field values from this WordPress installation
 * and generates ready-to-paste PHP arrays in the exact format used by
 * demo-content.php — so you can copy the output and update the demo
 * importer with real staging content.
 *
 * Tools → 📦 Export Content as PHP
 *
 * @package Racqueteer
 */

if ( ! defined( 'ABSPATH' ) ) exit;

// ─────────────────────────────────────────────
// Admin Menu
// ─────────────────────────────────────────────

add_action( 'admin_menu', function () {
    add_management_page(
        'Export Content as PHP',
        '📦 Export Content as PHP',
        'manage_options',
        'rq-content-export',
        'rq_content_exporter_page'
    );
} );

// ─────────────────────────────────────────────
// Admin Page
// ─────────────────────────────────────────────

function rq_content_exporter_page(): void {
    if ( ! current_user_can( 'manage_options' ) ) return;

    $section  = sanitize_key( $_GET['section'] ?? 'all' );
    $sections = [
        'all'         => '📦 All Sections',
        'jobs'        => '👔 Jobs',
        'testimonials'=> '💬 Testimonials',
        'locations'   => '📍 Locations',
        'amenities'   => '⭐ Amenities',
        'programs'    => '🎾 Programs',
        'memberships' => '💳 Membership Plans',
        'page_home'   => '🏠 Page: Home (block data)',
        'page_memberships'    => '💳 Page: Memberships (block data)',
        'page_private_events' => '🎉 Page: Private Events (block data)',
        'page_about'          => 'ℹ️ Page: About (block data)',
        'page_careers'        => '👔 Page: Careers (block data)',
        'site_options'        => '⚙️ Site Options (Navbar / Footer / Book Modal)',
    ];
    ?>
    <div class="wrap">
        <h1>📦 Export Content as PHP</h1>
        <p style="color:#50575e;max-width:760px;">
            Reads all current ACF field values from this staging site and generates PHP arrays
            in the exact format used by <code>wp/inc/demo-content.php</code>.<br>
            Copy the generated code and paste it into the corresponding function in <code>demo-content.php</code>
            to update the demo importer with real content.
        </p>

        <div style="display:flex;gap:16px;margin-top:16px;align-items:flex-start;">

            <!-- Sidebar nav -->
            <div style="background:#fff;border:1px solid #ccd0d4;padding:12px;min-width:200px;">
                <strong style="display:block;margin-bottom:8px;font-size:12px;text-transform:uppercase;color:#50575e;">Sections</strong>
                <?php foreach ( $sections as $key => $label ) : ?>
                    <a href="?page=rq-content-export&section=<?php echo esc_attr($key); ?>"
                       style="display:block;padding:5px 8px;font-size:13px;text-decoration:none;border-radius:3px;
                              <?php echo $section === $key ? 'background:#2271b1;color:#fff;' : 'color:#2271b1;'; ?>">
                        <?php echo esc_html($label); ?>
                    </a>
                <?php endforeach; ?>
            </div>

            <!-- Output -->
            <div style="flex:1;">
                <?php
                $output = '';
                switch ( $section ) {
                    case 'jobs':         $output = rq_export_jobs();         break;
                    case 'testimonials': $output = rq_export_testimonials(); break;
                    case 'locations':    $output = rq_export_locations();    break;
                    case 'amenities':    $output = rq_export_amenities();    break;
                    case 'programs':     $output = rq_export_programs();     break;
                    case 'memberships':  $output = rq_export_memberships();  break;
                    case 'page_home':    $output = rq_export_page_blocks('home',           'Home');           break;
                    case 'page_memberships':    $output = rq_export_page_blocks('memberships',   'Memberships');    break;
                    case 'page_private_events': $output = rq_export_page_blocks('private-events','Private Events'); break;
                    case 'page_about':   $output = rq_export_page_blocks('about',          'About');          break;
                    case 'page_careers': $output = rq_export_page_blocks('careers',        'Careers');        break;
                    case 'site_options': $output = rq_export_site_options(); break;
                    default:
                        $output  = rq_export_jobs() . "\n\n";
                        $output .= rq_export_testimonials() . "\n\n";
                        $output .= rq_export_locations() . "\n\n";
                        $output .= rq_export_amenities() . "\n\n";
                        $output .= rq_export_programs() . "\n\n";
                        $output .= rq_export_memberships() . "\n\n";
                        $output .= rq_export_site_options() . "\n\n";
                        $output .= rq_export_page_blocks('home', 'Home') . "\n\n";
                        $output .= rq_export_page_blocks('memberships', 'Memberships') . "\n\n";
                        $output .= rq_export_page_blocks('private-events', 'Private Events') . "\n\n";
                        $output .= rq_export_page_blocks('about', 'About') . "\n\n";
                        $output .= rq_export_page_blocks('careers', 'Careers');
                        break;
                }
                ?>
                <div style="background:#1e1e1e;border-radius:4px;padding:0;overflow:hidden;">
                    <div style="background:#2d2d2d;padding:8px 16px;display:flex;justify-content:space-between;align-items:center;">
                        <span style="color:#ccc;font-size:12px;font-family:monospace;">
                            <?php echo esc_html( $sections[ $section ] ); ?> — generated <?php echo esc_html( current_time('Y-m-d H:i:s') ); ?>
                        </span>
                        <button onclick="navigator.clipboard.writeText(document.getElementById('rq-export-code').value);this.textContent='✅ Copied!';"
                                style="background:#2271b1;color:#fff;border:none;padding:4px 14px;border-radius:3px;cursor:pointer;font-size:12px;">
                            📋 Copy All
                        </button>
                    </div>
                    <textarea id="rq-export-code"
                              readonly
                              style="width:100%;min-height:600px;background:#1e1e1e;color:#d4d4d4;
                                     font-family:'Fira Mono',Consolas,monospace;font-size:12px;
                                     line-height:1.6;padding:16px;border:none;resize:vertical;
                                     box-sizing:border-box;outline:none;"
                    ><?php echo esc_textarea( $output ); ?></textarea>
                </div>

                <div style="background:#fff3cd;border:1px solid #ffc107;border-radius:4px;padding:12px 16px;margin-top:12px;font-size:13px;">
                    <strong>📋 How to use:</strong><br>
                    1. Click <strong>Copy All</strong> above<br>
                    2. Open <code>wp/inc/demo-content.php</code> in your editor<br>
                    3. Find the matching function (e.g. <code>rq_create_jobs()</code>)<br>
                    4. Replace the <code>$jobs = [...]</code> array with the exported one<br>
                    5. For pages — replace the <code>rq_acf_block()</code> calls with the exported block data<br>
                    6. Save the file and re-deploy the theme to production
                </div>
            </div>
        </div>
    </div>
    <?php
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/** PHP var_export with cleaner formatting for strings */
function rq_ex( $value ): string {
    if ( is_string( $value ) ) {
        return "'" . addcslashes( $value, "'\\" ) . "'";
    }
    if ( is_bool( $value ) ) return $value ? 'true' : 'false';
    if ( is_null( $value ) ) return 'null';
    if ( is_int( $value ) || is_float( $value ) ) return (string) $value;
    return var_export( $value, true );
}

/** Get all posts of a CPT ordered by menu_order then date */
function rq_get_cpt( string $post_type ): array {
    return get_posts( [
        'post_type'      => $post_type,
        'post_status'    => 'publish',
        'posts_per_page' => -1,
        'orderby'        => 'menu_order',
        'order'          => 'ASC',
    ] );
}

/** Get ACF field value with fallback to post_meta */
function rq_gf( string $field, int $post_id ) {
    if ( function_exists('get_field') ) {
        $val = get_field( $field, $post_id );
        if ( $val !== null && $val !== false ) return $val;
    }
    return get_post_meta( $post_id, $field, true );
}

/** Get ACF option field */
function rq_go( string $field ) {
    if ( function_exists('get_field') ) {
        $val = get_field( $field, 'option' );
        if ( $val !== null && $val !== false ) return $val;
    }
    return get_option( $field, '' );
}

// ─────────────────────────────────────────────
// EXPORTERS — CPTs
// ─────────────────────────────────────────────

function rq_export_jobs(): string {
    $posts = rq_get_cpt('job');
    if ( empty($posts) ) return "// ⚠ No jobs found — run Demo Import first\n";

    $lines = [];
    foreach ( $posts as $p ) {
        $title = $p->post_title;
        $desc  = (string) rq_gf('description', $p->ID); // via jobFields
        if ( ! $desc ) $desc = (string) get_post_meta($p->ID, 'description', true);
        $cat   = (string) rq_gf('category', $p->ID);
        if ( ! $cat ) $cat = (string) get_post_meta($p->ID, 'category', true);
        $lines[] = '        [ ' . rq_ex($title) . ', ' . rq_ex($desc) . ', ' . rq_ex($cat) . ', ],';
    }
    $body = implode("\n", $lines);
    return "// ── Paste into rq_create_jobs() in demo-content.php ──────────────────────────\n"
         . "\$jobs = [\n"
         . $body . "\n"
         . "];\n";
}

function rq_export_testimonials(): string {
    $posts = rq_get_cpt('testimonial');
    if ( empty($posts) ) return "// ⚠ No testimonials found — run Demo Import first\n";

    $lines = [];
    foreach ( $posts as $p ) {
        $title    = $p->post_title;
        $quote    = (string) ( rq_gf('quote', $p->ID)           ?: get_post_meta($p->ID, 'quote', true) );
        $cat      = (string) ( rq_gf('category', $p->ID)        ?: get_post_meta($p->ID, 'category', true) );
        $rating   = (float)  ( rq_gf('rating', $p->ID)          ?: get_post_meta($p->ID, 'rating', true) ?: 5 );
        $maxRat   = (float)  ( rq_gf('max_rating', $p->ID)      ?: get_post_meta($p->ID, 'max_rating', true) ?: 5 );
        $author   = (string) ( rq_gf('author_name', $p->ID)     ?: get_post_meta($p->ID, 'author_name', true) );
        $subtitle = (string) ( rq_gf('author_subtitle', $p->ID) ?: get_post_meta($p->ID, 'author_subtitle', true) );
        $lines[] = '        [ ' . implode(', ', [
            rq_ex($title), rq_ex($quote), rq_ex($cat),
            rq_ex($rating), rq_ex($maxRat), rq_ex($author), rq_ex($subtitle),
        ]) . ', ],';
    }

    $body = implode("\n", $lines);
    return "// ── Paste into rq_create_testimonials() in demo-content.php ─────────────────\n"
         . "\$items = [\n"
         . $body . "\n"
         . "];\n";
}

function rq_export_locations(): string {
    $posts = rq_get_cpt('location');
    if ( empty($posts) ) return "// ⚠ No locations found — run Demo Import first\n";

    $out = "// ── Paste into rq_create_locations() in demo-content.php ────────────────────\n"
         . "\$locations = [\n";

    foreach ( $posts as $p ) {
        $title   = $p->post_title;
        $status  = (string) get_post_meta($p->ID, 'status', true);
        $address = (string) get_post_meta($p->ID, 'address', true);
        $desc    = (string) get_post_meta($p->ID, 'description', true);

        // Read amenities repeater directly from post meta
        $amen_count = (int) get_post_meta($p->ID, 'amenities', true);
        $amenities  = [];
        for ( $i = 0; $i < $amen_count; $i++ ) {
            $icon  = (string) get_post_meta($p->ID, "amenities_{$i}_icon",  true);
            $label = (string) get_post_meta($p->ID, "amenities_{$i}_label", true);
            if ( $icon || $label ) {
                $amenities[] = "                [ 'icon' => " . rq_ex($icon) . ", 'label' => " . rq_ex($label) . " ],";
            }
        }

        $addr_lines = array_map('trim', explode("\n", $address));
        $addr_php   = implode(', ', array_map('rq_ex', array_filter($addr_lines)));

        $amen_php = empty($amenities)
            ? '            /* no amenities found */'
            : implode("\n", $amenities);

        $out .= "    [\n"
              . "        " . rq_ex($title) . ", " . rq_ex($status) . ",\n"
              . "        [ {$addr_php} ],\n"
              . "        " . rq_ex($desc) . ",\n"
              . "        [\n"
              . $amen_php . "\n"
              . "        ],\n"
              . "    ],\n";
    }

    $out .= "];\n";
    return $out;
}

function rq_export_amenities(): string {
    $posts = rq_get_cpt('amenity');
    if ( empty($posts) ) return "// ⚠ No amenities found — run Demo Import first\n";

    $out = "// ── Paste into rq_create_amenities() in demo-content.php ────────────────────\n"
         . "// NOTE: image keys like 'amenity_courts_1' still reference \$media array — update manually if filenames changed.\n"
         . "\$items = [\n";

    foreach ( $posts as $p ) {
        $title   = $p->post_title;
        $num     = (string) ( get_post_meta($p->ID, 'number', true)       ?: '' );
        $layout  = (string) ( get_post_meta($p->ID, 'image_layout', true) ?: 'single' );
        $icon1   = (string) ( get_post_meta($p->ID, 'feature1_icon', true) ?: get_post_meta($p->ID, 'feat1_icon', true) );
        $text1   = (string) ( get_post_meta($p->ID, 'feature1_text', true) ?: get_post_meta($p->ID, 'feat1_text', true) );
        $icon2   = (string) ( get_post_meta($p->ID, 'feature2_icon', true) ?: get_post_meta($p->ID, 'feat2_icon', true) );
        $text2   = (string) ( get_post_meta($p->ID, 'feature2_text', true) ?: get_post_meta($p->ID, 'feat2_text', true) );

        $out .= "    [\n"
              . "        " . rq_ex($title) . ", " . rq_ex($num) . ", " . rq_ex($layout) . ",\n"
              . "        [ /* image IDs — see \$media array */ ],\n"
              . "        " . rq_ex($icon1) . ", " . rq_ex($text1) . ",\n"
              . "        " . rq_ex($icon2) . ", " . rq_ex($text2) . ",\n"
              . "    ],\n";
    }

    $out .= "];\n";
    return $out;
}

function rq_export_programs(): string {
    $posts = rq_get_cpt('program');
    if ( empty($posts) ) return "// ⚠ No programs found — run Demo Import first\n";

    $lines = [];
    foreach ( $posts as $p ) {
        $title = $p->post_title;
        $color = (string) ( get_post_meta($p->ID, 'color', true) ?: '' );
        $price = (string) ( get_post_meta($p->ID, 'price', true) ?: '' );
        $unit  = (string) ( get_post_meta($p->ID, 'unit', true)  ?: 'per game' );
        $desc  = (string) ( get_post_meta($p->ID, 'description', true) ?: '' );
        $link  = (string) ( get_post_meta($p->ID, 'link', true)  ?: '' );
        $lines[] = '        [ ' . implode(', ', [rq_ex($title), rq_ex($color), rq_ex($price), rq_ex($unit), rq_ex($desc), rq_ex($link)]) . ' ],';
    }

    $body = implode("\n", $lines);
    return "// ── Paste into rq_create_programs() in demo-content.php ─────────────────────\n"
         . "\$programs = [\n"
         . $body . "\n"
         . "];\n";
}

function rq_export_memberships(): string {
    $posts = rq_get_cpt('membership');
    if ( empty($posts) ) return "// ⚠ No membership plans found — run Demo Import first\n";

    $lines = [];
    foreach ( $posts as $p ) {
        $title      = $p->post_title;
        $desc       = (string) ( get_post_meta($p->ID, 'description',    true) ?: '' );
        $price      = (string) ( get_post_meta($p->ID, 'price',          true) ?: '' );
        $btn        = (string) ( get_post_meta($p->ID, 'button_variant', true) ?: 'blue' );
        $bg         = (string) ( get_post_meta($p->ID, 'bg_class',       true) ?: 'bg-white' );
        $border     = (string) ( get_post_meta($p->ID, 'border_class',   true) ?: 'border-[#E5E7EB]' );
        $has_img_raw = get_post_meta($p->ID, 'has_image', true);
        $has_img    = ( $has_img_raw === '1' || $has_img_raw === true || $has_img_raw === 1 );
        $values     = (string) ( get_post_meta($p->ID, 'values',         true) ?: '' );
        $cta_text   = (string) get_post_meta($p->ID, 'cta_text', true );
        $cta_url    = (string) ( get_post_meta($p->ID, 'cta_url',        true) ?: '' );

        $lines[] = '        [ ' . implode(', ', [
            rq_ex($title), rq_ex($desc), rq_ex($price), rq_ex($btn),
            rq_ex($bg), rq_ex($border), $has_img ? 'true' : 'false',
            rq_ex($values), rq_ex($cta_text), rq_ex($cta_url),
        ]) . ' ],';
    }

    $body = implode("\n", $lines);
    return "// ── Paste into rq_create_membership_plans() in demo-content.php ──────────────\n"
         . "\$plans = [\n"
         . $body . "\n"
         . "];\n";
}

// ─────────────────────────────────────────────
// EXPORTER — Pages (block data)
// ─────────────────────────────────────────────

function rq_export_page_blocks( string $slug, string $label ): string {
    $page = $slug === 'home'
        ? get_post( (int) get_option('page_on_front') )
        : get_page_by_path( $slug );

    if ( ! $page ) {
        return "// ⚠ Page '{$slug}' not found — run Demo Import first\n";
    }

    $raw     = $page->post_content;
    $blocks  = rq_parse_acf_blocks( $raw );

    if ( empty( $blocks ) ) {
        return "// ⚠ Page '{$slug}' has no ACF blocks — run Demo Import first\n";
    }

    $out = "// ── Paste block data into rq_create_page_{$slug}() in demo-content.php ────────\n";
    $out .= "// Page: {$label} (ID: {$page->ID})\n\n";

    foreach ( $blocks as $block ) {
        $name = $block['name'] ?? '';
        $data = $block['data'] ?? [];

        // Filter out _ prefixed keys (ACF field key refs) for readability, then add them back
        $display = [];
        foreach ( $data as $k => $v ) {
            if ( strpos($k, '_') !== 0 ) {
                $display[$k] = $v;
            }
        }

        $out .= "// Block: {$name}\n";
        $out .= "\$content .= rq_acf_block( " . rq_ex($name) . ", [\n";
        foreach ( $data as $k => $v ) {
            if ( is_array($v) ) {
                $out .= "    " . rq_ex($k) . " => " . var_export($v, true) . ",\n";
            } else {
                $out .= "    " . rq_ex($k) . " => " . rq_ex((string)$v) . ",\n";
            }
        }
        $out .= "] );\n\n";
    }

    return $out;
}

/**
 * Parse ACF Gutenberg block comments from post_content.
 * Returns array of [ 'name' => '...', 'data' => [...] ]
 */
function rq_parse_acf_blocks( string $content ): array {
    $blocks  = [];
    $pattern = '/<!--\s*wp:(acf\/[^\s{]+)\s+(\{.*?})\s*\/-->/s';

    if ( ! preg_match_all( $pattern, $content, $matches, PREG_SET_ORDER ) ) {
        return $blocks;
    }

    foreach ( $matches as $m ) {
        $name  = $m[1];
        $attrs = json_decode( $m[2], true );
        if ( ! is_array($attrs) ) continue;

        $data = $attrs['data'] ?? [];
        if ( empty($data) ) continue;

        $blocks[] = [
            'name' => $name,
            'data' => $data,
        ];
    }

    return $blocks;
}

// ─────────────────────────────────────────────
// EXPORTER — Site Options
// ─────────────────────────────────────────────

function rq_export_site_options(): string {
    $out = "// ── Paste into rq_set_site_options() in demo-content.php ────────────────────\n\n";

    // Navbar
    $navbar = function_exists('get_field') ? get_field('navbar', 'option') : [];
    $navbar = is_array($navbar) ? $navbar : [];

    $nav_cta_text = (string) ( $navbar['nav_cta_text'] ?? '' );
    $nav_cta_url  = (string) ( $navbar['nav_cta_url']  ?? '' );
    $nav_links    = (array)  ( $navbar['nav_links']    ?? [] );

    $out .= "// Navbar\n";
    $out .= "\$navbar_data = [\n";
    $out .= "    'nav_cta_text' => " . rq_ex($nav_cta_text) . ",\n";
    $out .= "    'nav_cta_url'  => " . rq_ex($nav_cta_url) . ",\n";
    $out .= "    'nav_links'    => [\n";
    foreach ( $nav_links as $link ) {
        $lbl = is_array($link) ? (string)($link['label'] ?? $link['text'] ?? '') : (string)$link;
        $url = is_array($link) ? (string)($link['url'] ?? '') : '';
        $out .= "        [ 'label' => " . rq_ex($lbl) . ", 'url' => " . rq_ex($url) . " ],\n";
    }
    $out .= "    ],\n";
    $out .= "];\n\n";

    // Footer
    $footer = function_exists('get_field') ? get_field('footer', 'option') : [];
    $footer = is_array($footer) ? $footer : [];

    $foot_email     = (string) ( $footer['footer_email']     ?? '' );
    $foot_copyright = (string) ( $footer['footer_copyright'] ?? '' );
    $foot_links     = (array)  ( $footer['footer_menu_links'] ?? [] );

    $out .= "// Footer\n";
    $out .= "\$footer_data = [\n";
    $out .= "    'footer_email'      => " . rq_ex($foot_email) . ",\n";
    $out .= "    'footer_copyright'  => " . rq_ex($foot_copyright) . ",\n";
    $out .= "    'footer_menu_links' => [\n";
    foreach ( $foot_links as $link ) {
        $lbl = is_array($link) ? (string)($link['label'] ?? '') : (string)$link;
        $url = is_array($link) ? (string)($link['url'] ?? '') : '';
        $out .= "        [ 'label' => " . rq_ex($lbl) . ", 'url' => " . rq_ex($url) . " ],\n";
    }
    $out .= "    ],\n";
    $out .= "];\n\n";

    // Book Modal
    $bm = function_exists('get_field') ? get_field('book_modal', 'option') : [];
    $bm = is_array($bm) ? $bm : [];

    $out .= "// Book Modal\n";
    $out .= "\$book_modal_data = [\n";
    foreach ([
        'modal_title', 'modal_subtitle',
        'sport1_title', 'sport1_button_text', 'sport1_booking_url',
        'sport2_title', 'sport2_button_text', 'sport2_booking_url',
    ] as $key ) {
        $val = (string) ( $bm[$key] ?? '' );
        $out .= "    " . rq_ex($key) . " => " . rq_ex($val) . ",\n";
    }
    $out .= "];\n\n";

    $out .= "// ⚠ NOTE: image/logo fields (nav_logo, footer_logo, sport1_image, sport2_image)\n";
    $out .= "// are attachment IDs specific to this WP install — they will be re-imported\n";
    $out .= "// from the media files by rq_import_media() on the target site.\n";

    return $out;
}

