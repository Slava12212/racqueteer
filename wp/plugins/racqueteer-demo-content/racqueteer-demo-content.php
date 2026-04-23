<?php
/**
 * Plugin Name: Racqueteer Demo Content Importer
 * Plugin URI:  https://racqueteer.com
 * Description: Автоматично створює всі сторінки, пости у CPT та налаштування сайту для Racqueteer headless WP + Next.js проєкту.
 * Version:     1.1.0
 * Author:      Racqueteer
 * Text Domain: racqueteer-demo
 *
 * УСТАНОВКА:
 *   1. Завантажити папку plugins/racqueteer-demo-content/ → wp-content/plugins/
 *   2. WP Admin → Plugins → Activate "Racqueteer Demo Content Importer"
 *   3. WP Admin → Tools → Racqueteer Import → натиснути "Import Demo Content"
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ─────────────────────────────────────────────
// Admin menu
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

    $results = [];
    $error   = '';

    if ( isset( $_POST['rq_import'] ) && check_admin_referer( 'rq_demo_import' ) ) {
        try {
            $results = rq_run_import();
        } catch ( \Throwable $e ) {
            $error = $e->getMessage();
        }
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
            </div>
        <?php endif; ?>

        <div style="background:#fff;padding:24px;border:1px solid #ccd0d4;max-width:720px;margin-top:16px;">

            <h2 style="margin-top:0;">Що буде створено</h2>
            <ul style="list-style:disc;margin-left:20px;line-height:1.8;">
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
                    <p>ℹ️ Контент вже імпортувався раніше. Повторний запуск оновить наявний контент (не дублює).</p>
                </div>
            <?php endif; ?>

            <form method="post" style="margin-top:16px;">
                <?php wp_nonce_field( 'rq_demo_import' ); ?>
                <button type="submit" name="rq_import" class="button button-primary" style="font-size:15px;height:40px;padding:0 24px;">
                    🚀 <?php echo $already ? 'Re-import Demo Content' : 'Import Demo Content'; ?>
                </button>
            </form>
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

    // Load WP media helpers
    require_once ABSPATH . 'wp-admin/includes/image.php';
    require_once ABSPATH . 'wp-admin/includes/file.php';
    require_once ABSPATH . 'wp-admin/includes/media.php';

    // 1. Import media assets from Next.js public folder → WP Media Library
    $log[] = '— Importing media assets…';
    $media = rq_import_media( $nextjs, $log );

    // 2. CPT entries
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

    // 3. Pages with ACF blocks
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

    // 4. Site options (Navbar, Footer)
    $log[] = '— Setting site options (Navbar / Footer)…';
    rq_set_site_options( $media, $log );

    update_option( 'rq_demo_imported', current_time( 'mysql' ) );
    $log[] = '✅ All done!';

    return $log;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────

/**
 * Serialize a single ACF Gutenberg block (stores data inline in block comment).
 * The _fieldname → field_key pairs are ACF's internal mapping.
 */
function rq_acf_block( string $block_name, array $data ): string {
    $attrs = [
        'name' => $block_name,
        'data' => $data,
        'mode' => 'preview',
    ];
    return '<!-- wp:' . $block_name . ' ' . wp_json_encode( $attrs, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES ) . ' /-->' . "\n";
}

/**
 * Find or create a page by slug. Returns post ID.
 */
function rq_upsert_page( string $title, string $slug, string $content, string $parent_slug = '' ): int {
    $existing = get_page_by_path( $slug );
    $parent   = 0;
    if ( $parent_slug ) {
        $p = get_page_by_path( $parent_slug );
        if ( $p ) {
            $parent = $p->ID;
        }
    }

    $args = [
        'post_title'   => $title,
        'post_name'    => $slug,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_type'    => 'page',
        'post_parent'  => $parent,
    ];

    if ( $existing ) {
        $args['ID'] = $existing->ID;
        wp_update_post( $args );
        return $existing->ID;
    }

    return wp_insert_post( $args );
}

/**
 * Find or create a CPT post by title. Returns post ID.
 */
function rq_upsert_cpt( string $post_type, string $title, array $acf_data = [], string $content = '' ): int {
    $existing = get_posts( [
        'post_type'      => $post_type,
        'post_status'    => 'publish',
        'title'          => $title,
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ] );

    $args = [
        'post_title'   => $title,
        'post_content' => $content,
        'post_status'  => 'publish',
        'post_type'    => $post_type,
    ];

    if ( $existing ) {
        $args['ID'] = $existing[0];
        wp_update_post( $args );
        $post_id = $existing[0];
    } else {
        $post_id = wp_insert_post( $args );
    }

    // Set ACF fields via update_field (key-based)
    if ( $post_id && ! is_wp_error( $post_id ) && function_exists( 'update_field' ) ) {
        foreach ( $acf_data as $field_key => $value ) {
            update_field( $field_key, $value, $post_id );
        }
    }

    return is_wp_error( $post_id ) ? 0 : $post_id;
}

/**
 * Sideload an image from URL → WP Media Library.
 * Returns attachment ID (or 0 on failure). Caches IDs to avoid re-importing.
 */
function rq_sideload_image( string $url, string $title = '' ): int {
    $cache_key = 'rq_media_' . md5( $url );
    $cached    = get_option( $cache_key, 0 );
    if ( $cached && get_post( $cached ) ) {
        return (int) $cached;
    }

    $tmp = download_url( $url, 15 );
    if ( is_wp_error( $tmp ) ) {
        return 0;
    }

    $file_array = [
        'name'     => $title ?: basename( parse_url( $url, PHP_URL_PATH ) ),
        'tmp_name' => $tmp,
    ];

    $id = media_handle_sideload( $file_array, 0, $title );

    @unlink( $tmp );

    if ( is_wp_error( $id ) ) {
        return 0;
    }

    update_option( $cache_key, $id );
    return (int) $id;
}

// ─────────────────────────────────────────────
// MEDIA IMPORT
// ─────────────────────────────────────────────

function rq_import_media( string $nextjs, array &$log ): array {
    $assets = [
        'logo'                  => $nextjs . 'logo2.svg',
        'logo_icon'             => $nextjs . 'logo-icon.png',
        'racket_pickleball'     => $nextjs . 'racket-pickleball.png',
        'racket_padel'          => $nextjs . 'racket-padel.png',
        'rackets_mobile'        => $nextjs . 'rackets-mobile.png',
        'membership_bg'         => $nextjs . 'membership-bg.png',
        'membership_pickleball' => $nextjs . 'membership-racket-pickleball.png',
        'membership_padel'      => $nextjs . 'membership-racket-padel.png',
        'about_hero'            => $nextjs . 'about-hero.png',
        'contact_bg'            => $nextjs . 'contact-bg.png',
    ];

    $media = [];
    foreach ( $assets as $key => $url ) {
        $id = rq_sideload_image( $url, $key );
        if ( $id ) {
            $media[ $key ] = $id;
            $log[] = "  ✔ Media imported: {$key} (ID {$id})";
        } else {
            $media[ $key ] = 0;
            $log[] = "  ⚠ Media skipped (unreachable?): {$url}";
        }
    }

    return $media;
}

// ─────────────────────────────────────────────
// CPT: JOBS
// ─────────────────────────────────────────────

function rq_create_jobs( array &$log ): void {
    $jobs = [
        [ 'Club Manager',        'Lead daily operations, manage staff scheduling, oversee member relations, and ensure an exceptional experience across all club facilities.',                                               'Manager', 'Apr 1, 2026' ],
        [ 'Assistant Manager',   'Support the Club Manager in daily operations, coordinate events, handle member inquiries, and step in as acting manager when needed.',                                                    'Manager', 'Apr 1, 2026' ],
        [ 'Head Pickleball Coach','Design and lead pickleball training programs for all skill levels. Conduct private lessons, group clinics, and competitive development sessions.',                                       'Trainer', 'Mar 28, 2026' ],
        [ 'Padel Trainer',       'Deliver high-energy padel coaching sessions, develop player technique, and help grow the padel community at the club through engaging programs.',                                         'Trainer', 'Mar 25, 2026' ],
        [ 'Youth Program Coach', 'Run junior development programs, create age-appropriate training plans, and build a fun and encouraging environment for young players.',                                                   'Trainer', 'Mar 20, 2026' ],
        [ 'Lead Barista',        'Manage the club café, craft specialty coffee and drinks, maintain quality standards, and train new barista team members.',                                                                 'Barista', 'Apr 3, 2026' ],
        [ 'Barista',             'Prepare and serve premium beverages, maintain a clean and welcoming café space, and provide excellent customer service to members and guests.',                                             'Barista', 'Apr 3, 2026' ],
        [ 'Front Desk Associate','Welcome members and guests, handle court bookings, answer questions, and ensure smooth check-in and check-out experiences daily.',                                                         'Manager', 'Mar 15, 2026' ],
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
        [
            'Martin Goutry — Beginner',
            '"The training was fun, well organized, and easy to follow. I quickly gained confidence on the court and truly enjoyed the atmosphere. I\'m excited to come back and keep improving!"',
            'Beginner Training', 5.0, 5.0, 'Martin Goutry', 'Beginner Training',
        ],
        [
            'Sarah Chen — Advanced',
            '"Incredible coaching and a very supportive environment. The drills were intense but effective. My serve has improved tremendously since joining. Highly recommend to anyone serious about the sport!"',
            'Advanced Training', 5.0, 5.0, 'Sarah Chen', 'Advanced Training',
        ],
        [
            'James Okafor — Intermediate',
            '"Exactly what I needed to level up my game. The coaches are attentive and the class sizes are perfect. I feel a genuine improvement after every session."',
            'Intermediate Training', 5.0, 5.0, 'James Okafor', 'Intermediate Training',
        ],
        [
            'Emily Rodriguez — Beginner',
            '"As someone who\'d never played before, I was nervous walking in. The instructors made it so welcoming and fun. Now I\'m hooked and I play every week!"',
            'Beginner Training', 5.0, 5.0, 'Emily Rodriguez', 'Beginner Training',
        ],
        [
            'Lisa Park — Advanced',
            '"The advanced clinics pushed my game to new heights. The coaching staff are incredibly knowledgeable and the facilities are world class. Best decision I\'ve made!"',
            'Advanced Training', 5.0, 5.0, 'Lisa Park', 'Advanced Training',
        ],
        [
            'Tom Walker — Intermediate',
            '"Fantastic community, brilliant coaches. The intermediate program gave me exactly the structured practice I needed. Can\'t recommend Racqueteer enough!"',
            'Intermediate Training', 5.0, 5.0, 'Tom Walker', 'Intermediate Training',
        ],
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
            'Homebush Club',
            'available',
            [ 'Homebush, Sydney', 'New South Wales 2140, Australia' ],
            'Perfect for newcomers and those looking to refine their foundational skills, this clinic provides a supportive environment for learning and improvement.',
            $media['about_hero'] ?? 0,
        ],
        [
            'Alexandria Club',
            'coming_soon',
            [ 'Alexandria, Sydney', 'New South Wales 2015, Australia' ],
            'Our newest location coming soon to Alexandria. A world-class facility designed for serious players and casual enthusiasts alike.',
            $media['about_hero'] ?? 0,
        ],
    ];

    foreach ( $locations as [ $title, $status, $address, $desc, $img ] ) {
        $acf = [
            'field_loc_location_id'  => sanitize_title( $title ),
            'field_loc_name'         => $title,
            'field_loc_status'       => $status,
            'field_loc_address'      => $address,
            'field_loc_description'  => $desc,
        ];
        if ( $img ) {
            $acf['field_loc_image'] = $img;
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
        [
            "Women's Beginners",
            'red', '$40', 'per game',
            "This introductory session is the perfect way to get started! We'll cover the basics of the game, from the rules and scoring to essential techniques like grip, positioning, and basic shots. Whether you're completely new or have some experience, this fun and informative session will help you build confidence on the court and develop a solid foundation in padel.",
        ],
        [
            'Mens Beginner',
            'blue', '$40', 'per game',
            "Join our fun and supportive group clinic designed specifically for beginners! Whether you're new to padel or just starting to play, this clinic will help you master the fundamentals. Our experienced coaches will guide you through the essential techniques and strategies of the game.",
        ],
        [
            'Group Beginner',
            'red', '$60', 'per game',
            "Take your padel skills to the next level in our intermediate clinic! Perfect for those who already know the basics, this clinic focuses on refining your technique, improving shot placement, and enhancing court awareness. Our coaches will push you to improve every aspect of your game.",
        ],
        [
            "Women's Intermediate",
            'blue', '$80', 'per game',
            "This clinic is designed for top players looking to perfect their game and get an edge on their opponents. Focus will be on very advanced techniques/shots, precision, and strategic play. You'll work on improving complex shot combinations and court positioning.",
        ],
    ];

    foreach ( $programs as [ $title, $color, $price, $unit, $desc ] ) {
        $id = rq_upsert_cpt( 'program', $title, [
            'field_prog_title'       => $title,
            'field_prog_color'       => $color,
            'field_prog_price'       => $price,
            'field_prog_unit'        => $unit,
            'field_prog_description' => $desc,
        ] );
        $log[] = "  ✔ Program: {$title} (ID {$id})";
    }
}

// ─────────────────────────────────────────────
// CPT: MEMBERSHIP PLANS
// ─────────────────────────────────────────────

function rq_create_membership_plans( array &$log ): void {
    $plans = [
        [
            'STARTER',
            'Perfect for getting started',
            '$89', 'blue', 'bg-[#F4F6F9]', 'border-[#E5E7EB]', false,
            'check,check,check,cross,cross,cross,cross,0,2 days',
        ],
        [
            'LIGHT',
            'Great choice to begin your journey',
            '$135', 'blue', 'bg-white', 'border-[#E5E7EB]', false,
            'check,check,check,check,check,cross,cross,4,4 days',
        ],
        [
            'PRO',
            'Ideal for launching your experience',
            '$189', 'red', 'bg-white', 'border-[#E5E7EB]', true,
            'check,check,check,check,check,check,cross,10,7 days',
        ],
        [
            'PRO+',
            'Best suited for serious players',
            '$397', 'red', 'bg-white', 'border-[#E5E7EB]', false,
            'check,check,check,check,check,check,check,12,14 days',
        ],
    ];

    foreach ( $plans as [ $title, $desc, $price, $btnVariant, $bgClass, $borderClass, $hasImage, $values ] ) {
        $id = rq_upsert_cpt( 'membership', $title, [
            'field_mem_description'     => $desc,
            'field_mem_price'           => $price,
            'field_mem_button_variant'  => $btnVariant,
            'field_mem_bg_class'        => $bgClass,
            'field_mem_border_class'    => $borderClass,
            'field_mem_has_image'       => $hasImage ? '1' : '0',
            'field_mem_values'          => $values,
        ] );
        $log[] = "  ✔ Membership plan: {$title} (ID {$id})";
    }
}

// ─────────────────────────────────────────────
// PAGES
// ─────────────────────────────────────────────

/** HOME PAGE */
function rq_create_page_home( string $nextjs, array $media, array &$log ): void {
    $left_img  = $media['racket_pickleball'] ?? 0;
    $right_img = $media['racket_padel']      ?? 0;

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
        'label'                => 'about racqueteer',
        '_label'               => 'field_about_label',
        'title'                => 'The Ultimate Destination for Padel & Pickleball Players',
        '_title'               => 'field_about_title',
        'description'          => 'Racqueteer is more than just a place to play — it\'s a hub for the fast-growing world of padel and pickleball. Designed for players of all levels, our club combines professional courts, a welcoming community, and world-class facilities to create an unforgettable playing experience.',
        '_description'         => 'field_about_description',
        'stat1_number'         => '25',
        '_stat1_number'        => 'field_about_stat1_num',
        'stat1_label'          => 'Courts of Art',
        '_stat1_label'         => 'field_about_stat1_lbl',
        'stat2_number'         => '8+',
        '_stat2_number'        => 'field_about_stat2_num',
        'stat2_label'          => 'Years of Experience',
        '_stat2_label'         => 'field_about_stat2_lbl',
        'left_image'           => $left_img ?: ( $nextjs . 'racket-pickleball.png' ),
        '_left_image'          => 'field_about_left_image',
        'right_image'          => $right_img ?: ( $nextjs . 'racket-padel.png' ),
        '_right_image'         => 'field_about_right_image',
    ] );

    $content .= rq_acf_block( 'acf/racqueteer-locations', [
        'label'        => 'locations',
        '_label'       => 'field_loc_label',
        'title'        => 'Play at Your Favorite Location',
        '_title'       => 'field_loc_title',
        'description'  => 'With multiple state-of-the-art locations across Sydney, we make it easy to find a club near you. Each facility features top-tier courts, premium amenities, and a welcoming community of players.',
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
        'description'  => 'From competitive tournaments to casual social mixers, there\'s always something happening at Racqueteer. Connect with fellow players, challenge yourself, and have fun!',
        '_description' => 'field_events_description',
        'cta_text'     => 'View Events Calendar',
        '_cta_text'    => 'field_events_cta_text',
        'cta_url'      => '#',
        '_cta_url'     => 'field_events_cta_url',
        'image'        => $media['about_hero'] ?: '',
        '_image'       => 'field_events_image',
    ] );

    $page_id = rq_upsert_page( 'Home', 'home', $content );

    // Set as static front page
    update_option( 'show_on_front', 'page' );
    update_option( 'page_on_front', $page_id );

    $log[] = "  ✔ Page: Home (ID {$page_id}) — set as front page";
}

/** MEMBERSHIPS PAGE */
function rq_create_page_memberships( string $nextjs, array $media, array &$log ): void {
    $content  = rq_acf_block( 'acf/racqueteer-membership-hero', [
        'label'          => 'membership',
        '_label'         => 'field_mhero_label',
        'title'          => 'Become a Member',
        '_title'         => 'field_mhero_title',
        'description'    => 'We are thrilled to have you consider becoming a part of our community',
        '_description'   => 'field_mhero_description',
        'price_starting' => '$89',
        '_price_starting'=> 'field_mhero_price_starting',
        'price_unit'     => '/month',
        '_price_unit'    => 'field_mhero_price_unit',
        'cta_text'       => 'View Plans',
        '_cta_text'      => 'field_mhero_cta_text',
        'video_url'      => $nextjs . 'private-events-hero.mp4',
        '_video_url'     => 'field_mhero_video',
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
        'description'  => 'See all the benefits side-by-side to help you choose the right membership level for your needs.',
        '_description' => 'field_pc_description',
    ] );

    $page_id = rq_upsert_page( 'Memberships', 'memberships', $content );
    $log[] = "  ✔ Page: Memberships (ID {$page_id})";
}

/** PRIVATE EVENTS PAGE */
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
        'images'       => [], // Admin to add photos via WP Media
        '_images'      => 'field_gal_images',
    ] );

    // Build logos array from local SVG files
    $logo_ids = [];
    for ( $i = 1; $i <= 8; $i++ ) {
        $logo_id = rq_sideload_image( $nextjs . "logo{$i}.svg", "Partner Logo {$i}" );
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

/** ABOUT PAGE */
function rq_create_page_about( string $nextjs, array $media, array &$log ): void {
    $about_hero_img = $media['about_hero'] ?? 0;
    $contact_bg_img = $media['contact_bg'] ?? 0;

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
        'description'  => 'We\'re committed to providing world-class facilities, expert coaching, and a welcoming environment where players of all levels can improve, connect, and have fun. Whether you\'re picking up a paddle for the first time or competing at the highest level, you belong here.',
        '_description' => 'field_miss_description',
        'image'        => $about_hero_img ?: '',
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

/** CAREERS PAGE */
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
        'image'        => $media['about_hero'] ?: '',
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

    // ── Navbar ──
    update_field( 'field_nav_logo',      $logo_id,      'options' );
    update_field( 'field_nav_logo_icon', $logo_icon_id, 'options' );
    update_field( 'field_nav_cta_text',  'Book a Court', 'options' );
    update_field( 'field_nav_cta_url',   '#',            'options' );
    update_field( 'field_nav_links', [
        [ 'label' => 'Home',             'url' => '/'              ],
        [ 'label' => 'Coaching',         'url' => '#'              ],
        [ 'label' => 'Events & Programs','url' => '#'              ],
        [ 'label' => 'Membership',       'url' => '/memberships'   ],
        [ 'label' => 'Private Events',   'url' => '/private-events'],
        [ 'label' => 'About Us',         'url' => '/about'         ],
        [ 'label' => 'Careers',          'url' => '/careers'       ],
    ], 'options' );
    $log[] = '  ✔ Navbar options saved';

    // ── Footer ──
    update_field( 'field_footer_logo',      $logo_id, 'options' );
    update_field( 'field_footer_email',     'info.racqueteer.club@gmail.com', 'options' );
    update_field( 'field_footer_phone',     '+61 4 8123 4567', 'options' );
    update_field( 'field_footer_cta_text',  'Book a Court', 'options' );
    update_field( 'field_footer_cta_url',   '#', 'options' );
    update_field( 'field_footer_menu_links', [
        [ 'label' => 'Membership',     'url' => '/memberships'    ],
        [ 'label' => 'Events',         'url' => '#'               ],
        [ 'label' => 'Private Events', 'url' => '/private-events' ],
        [ 'label' => 'Coaching',       'url' => '#'               ],
        [ 'label' => 'About Us',       'url' => '/about'          ],
        [ 'label' => 'Careers',        'url' => '/careers'        ],
    ], 'options' );
    update_field( 'field_footer_locations', [
        [ 'name' => 'Homebush Club',  'address' => 'Homebush, Sydney. New South Wales 2140, Australia' ],
        [ 'name' => 'Alexandria Club','address' => 'Alexandria, Sydney. Australia'                     ],
    ], 'options' );
    update_field( 'field_footer_copyright', '©2026 Racqueteer. All Rights Reserved.', 'options' );
    update_field( 'field_footer_legal_links', [
        [ 'label' => 'Conditions',      'url' => '#' ],
        [ 'label' => 'Terms of Service','url' => '#' ],
        [ 'label' => 'Privacy Policy',  'url' => '#' ],
    ], 'options' );
    $log[] = '  ✔ Footer options saved';
}

