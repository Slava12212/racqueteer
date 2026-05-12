<?php
/**
 * Реєстрація ACF Blocks
 * Реєструє всі Gutenberg-блоки через ACF PRO (headless — render_callback повертає порожній рядок на фронтенді).
 */
if ( ! function_exists( 'acf_register_block_type' ) ) {
    return;
}

/**
 * Headless render callback — виводить мінімальний плейсхолдер в редакторі, щоб ACF
 * міг коректно ініціалізуватися та зберігати значення полів. На фронтенді
 * повертає порожній рядок (використовується лише як CMS/API бекенд).
 */
function racqueteer_block_render_callback( array $block ): void {
    // На фронтенді (headless) — нічого не виводимо.
    if ( ! is_admin() && ! ( defined( 'REST_REQUEST' ) && REST_REQUEST ) ) {
        return;
    }

    $title  = esc_html( $block['title'] ?? $block['name'] );
    $name   = esc_attr( $block['name'] );
    $fields = get_fields();
    $has_data = ! empty( $fields ) && is_array( $fields );
    ?>
    <div data-block="<?php echo $name; ?>" style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;border:2px solid #2271b1;border-radius:4px;overflow:hidden;background:#fff;">

        <div style="background:#2271b1;padding:8px 14px;display:flex;align-items:center;gap:8px;">
            <span style="color:#fff;font-weight:600;font-size:13px;">⚙ <?php echo $title; ?></span>
            <span style="margin-left:auto;color:rgba(255,255,255,0.6);font-size:11px;">Racqueteer Block</span>
        </div>

        <?php if ( $has_data ) : ?>
            <table style="width:100%;border-collapse:collapse;">
                <?php foreach ( $fields as $key => $val ) :
                    if ( ! is_scalar( $val ) || $val === '' ) continue;
                    $display = mb_strlen( (string) $val ) > 140
                        ? esc_html( mb_substr( (string) $val, 0, 140 ) ) . '…'
                        : esc_html( (string) $val );
                ?>
                <tr style="border-top:1px solid #f0f0f0;">
                    <td style="padding:6px 14px;color:#50575e;font-size:11px;white-space:nowrap;width:160px;background:#f9f9f9;vertical-align:top;">
                        <?php echo esc_html( ucwords( str_replace( '_', ' ', $key ) ) ); ?>
                    </td>
                    <td style="padding:6px 14px;font-size:12px;color:#1e1e1e;"><?php echo $display; ?></td>
                </tr>
                <?php endforeach; ?>
            </table>
        <?php else : ?>
            <p style="margin:0;padding:16px 14px;color:#8c8f94;font-size:12px;text-align:center;">
                No field data
            </p>
        <?php endif; ?>

    </div>
    <?php
}

add_action( 'acf/init', function () {
    $blocks = [
        // Головна
        ['name'=>'racqueteer-hero','title'=>'Hero Section','icon'=>'cover-image','keywords'=>['hero','banner'],'fields'=>[
            ['key'=>'field_hero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_hero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_hero_cta_primary_text','label'=>'CTA Primary Text','name'=>'cta_primary_text','type'=>'text'],
            ['key'=>'field_hero_cta_primary_url','label'=>'CTA Primary URL','name'=>'cta_primary_url','type'=>'text','instructions'=>'e.g. /memberships or https://...'],
            ['key'=>'field_hero_cta_secondary_text','label'=>'CTA Secondary Text','name'=>'cta_secondary_text','type'=>'text'],
            ['key'=>'field_hero_cta_secondary_url','label'=>'CTA Secondary URL','name'=>'cta_secondary_url','type'=>'text','instructions'=>'e.g. /about or https://...'],
            ['key'=>'field_hero_video','label'=>'Video URL','name'=>'video_url','type'=>'text','instructions'=>'Full URL to the video file'],
        ]],
        ['name'=>'racqueteer-about','title'=>'About Section','icon'=>'info','keywords'=>['about'],'fields'=>[
            ['key'=>'field_about_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_about_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_about_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_about_stat1_num','label'=>'Stat 1 Number','name'=>'stat1_number','type'=>'text'],
            ['key'=>'field_about_stat1_lbl','label'=>'Stat 1 Label','name'=>'stat1_label','type'=>'text'],
            ['key'=>'field_about_stat2_num','label'=>'Stat 2 Number','name'=>'stat2_number','type'=>'text'],
            ['key'=>'field_about_stat2_lbl','label'=>'Stat 2 Label','name'=>'stat2_label','type'=>'text'],
            ['key'=>'field_about_left_image','label'=>'Left Image','name'=>'left_image','type'=>'image','return_format'=>'url'],
            ['key'=>'field_about_right_image','label'=>'Right Image','name'=>'right_image','type'=>'image','return_format'=>'url'],
        ]],
        ['name'=>'racqueteer-locations','title'=>'Locations Section','icon'=>'location-alt','keywords'=>['locations'],'fields'=>[
            ['key'=>'field_loc_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_loc_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_loc_description','label'=>'Description','name'=>'description','type'=>'textarea'],
        ]],
        ['name'=>'racqueteer-amenities','title'=>'Amenities Section','icon'=>'list-view','keywords'=>['amenities'],'fields'=>[
            ['key'=>'field_amen_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_amen_title','label'=>'Title','name'=>'title','type'=>'text'],
            // Amenities are managed via the Amenity CPT — no repeater needed here.
        ]],
        ['name'=>'racqueteer-programs','title'=>'Programs Section','icon'=>'clipboard','keywords'=>['programs'],'fields'=>[
            ['key'=>'field_prog_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_prog_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_prog_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_prog_tabs','label'=>'Tabs (comma-separated)','name'=>'tabs','type'=>'text'],
        ]],
        ['name'=>'racqueteer-membership-cta','title'=>'Membership CTA','icon'=>'awards','keywords'=>['membership'],'fields'=>[
            ['key'=>'field_mship_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_mship_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_mship_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_mship_cta_text','label'=>'CTA Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_mship_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'text','instructions'=>'e.g. /memberships'],
            ['key'=>'field_mship_bg_image','label'=>'Background Image','name'=>'bg_image','type'=>'image','return_format'=>'url'],
        ]],
        ['name'=>'racqueteer-subscriptions','title'=>'Subscriptions (Home)','icon'=>'tag','keywords'=>['subscriptions'],'fields'=>[
            ['key'=>'field_subs_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_subs_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_subs_description','label'=>'Description','name'=>'description','type'=>'textarea'],
        ]],
        ['name'=>'racqueteer-testimonials','title'=>'Testimonials Section','icon'=>'format-quote','keywords'=>['testimonials'],'fields'=>[
            ['key'=>'field_test_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_test_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_test_description','label'=>'Description','name'=>'description','type'=>'textarea'],
        ]],
        ['name'=>'racqueteer-events','title'=>'Events Section','icon'=>'calendar-alt','keywords'=>['events'],'fields'=>[
            ['key'=>'field_events_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_events_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_events_cta_text','label'=>'CTA Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_events_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'text','instructions'=>'e.g. /events'],
            ['key'=>'field_events_image','label'=>'Image','name'=>'image','type'=>'image','return_format'=>'url'],
        ]],
        // Сторінка Memberships
        ['name'=>'racqueteer-membership-hero','title'=>'Membership Hero','icon'=>'cover-image','keywords'=>['membership','hero'],'fields'=>[
            ['key'=>'field_mhero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_mhero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_mhero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_mhero_price_starting','label'=>'Price Starting','name'=>'price_starting','type'=>'text'],
            ['key'=>'field_mhero_price_unit','label'=>'Price Unit','name'=>'price_unit','type'=>'text'],
            ['key'=>'field_mhero_cta_text','label'=>'CTA Button Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_mhero_cta_url','label'=>'CTA Button URL','name'=>'cta_url','type'=>'text','instructions'=>'e.g. /memberships or https://...'],
            ['key'=>'field_mhero_video','label'=>'Video URL','name'=>'video_url','type'=>'text','instructions'=>'Full URL to the video file'],
        ]],
        ['name'=>'racqueteer-subscriptions-detail','title'=>'Subscriptions Detail','icon'=>'tag','keywords'=>['subscriptions','plans'],'fields'=>[
            ['key'=>'field_subsd_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_subsd_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_subsd_description','label'=>'Description','name'=>'description','type'=>'textarea'],
        ]],
        ['name'=>'racqueteer-price-compare','title'=>'Price Compare','icon'=>'list-view','keywords'=>['price','compare'],'fields'=>[
            ['key'=>'field_pc_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_pc_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_pc_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_pc_cta_text','label'=>'CTA Button Text','name'=>'cta_text','type'=>'text','instructions'=>'e.g. Join Now'],
            ['key'=>'field_pc_cta_url','label'=>'CTA Button URL','name'=>'cta_url','type'=>'text','instructions'=>'e.g. /memberships or https://...'],
        ]],
        // Сторінка Private Events
        ['name'=>'racqueteer-private-events-hero','title'=>'Private Events Hero','icon'=>'cover-image','keywords'=>['private events'],'fields'=>[
            ['key'=>'field_pehero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_pehero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_pehero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_pehero_cta_text','label'=>'CTA Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_pehero_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'text','instructions'=>'e.g. /private-events'],
            ['key'=>'field_pehero_video','label'=>'Video URL','name'=>'video_url','type'=>'text','instructions'=>'Full URL to the video file'],
        ]],
        ['name'=>'racqueteer-gallery','title'=>'Gallery Section','icon'=>'format-gallery','keywords'=>['gallery'],'fields'=>[
            ['key'=>'field_gal_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_gal_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_gal_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_gal_images','label'=>'Images','name'=>'images','type'=>'gallery','return_format'=>'url'],
        ]],
        ['name'=>'racqueteer-logo-marquee','title'=>'Logo Marquee','icon'=>'slides','keywords'=>['logos','partners'],'fields'=>[
            ['key'=>'field_logo_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_logo_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_logo_logos','label'=>'Logos','name'=>'logos','type'=>'gallery','return_format'=>'array'],
        ]],
        // Сторінка About
        ['name'=>'racqueteer-about-hero','title'=>'About Hero','icon'=>'cover-image','keywords'=>['about','hero'],'fields'=>[
            ['key'=>'field_ahero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_ahero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_ahero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_ahero_video','label'=>'Video URL','name'=>'video_url','type'=>'text','instructions'=>'Full URL to the video file'],
        ]],
        ['name'=>'racqueteer-mission','title'=>'Mission Section','icon'=>'heart','keywords'=>['mission'],'fields'=>[
            ['key'=>'field_miss_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_miss_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_miss_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_miss_image','label'=>'Image','name'=>'image','type'=>'image','return_format'=>'url'],
        ]],
        ['name'=>'racqueteer-contact','title'=>'Contact Section','icon'=>'email','keywords'=>['contact'],'fields'=>[
            ['key'=>'field_cont_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_cont_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_cont_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_cont_email','label'=>'Email','name'=>'email','type'=>'email'],
            ['key'=>'field_cont_phone','label'=>'Phone','name'=>'phone','type'=>'text'],
            ['key'=>'field_cont_cta_text','label'=>'CTA Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_cont_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'text','instructions'=>'e.g. /contact'],
        ]],
        // Сторінка Careers
        ['name'=>'racqueteer-careers-hero','title'=>'Careers Hero','icon'=>'cover-image','keywords'=>['careers'],'fields'=>[
            ['key'=>'field_chero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_chero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_chero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_chero_video','label'=>'Video URL','name'=>'video_url','type'=>'text','instructions'=>'Full URL to the video file'],
        ]],
        ['name'=>'racqueteer-job-listings','title'=>'Job Listings','icon'=>'list-view','keywords'=>['jobs'],'fields'=>[
            ['key'=>'field_jobs_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_jobs_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_jobs_description','label'=>'Description','name'=>'description','type'=>'textarea'],
        ]],
        ['name'=>'racqueteer-career-contact','title'=>'Career Contact','icon'=>'email','keywords'=>['careers','contact'],'fields'=>[
            ['key'=>'field_cc_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_cc_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_cc_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_cc_cta_text','label'=>'CTA Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_cc_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'text','instructions'=>'e.g. /careers'],
            ['key'=>'field_cc_image','label'=>'Image','name'=>'image','type'=>'image','return_format'=>'url'],
        ]],
    ];
    foreach ( $blocks as $block ) {
        $fields = $block['fields'];
        unset( $block['fields'] );
        // graphql_field_name: camelCase-ім'я, яке WPGraphQL for ACF використовує для атрибутів блоку
        // наприклад: 'racqueteer-hero' → 'racqueteerHero' → тип AcfRacqueteerHeroBlock
        $graphql_name = lcfirst( str_replace( '-', '', ucwords( $block['name'], '-' ) ) );
        acf_register_block_type( array_merge( $block, [
            'api_version'        => 3,
            'category'           => 'racqueteer',
            'mode'               => 'edit',
            'render_callback'    => 'racqueteer_block_render_callback',
            'supports'           => [ 'jsx' => false ],
            'show_in_graphql'    => true, // ← ОБОВ'ЯЗКОВО для WPGraphQL Content Blocks
            'graphql_field_name' => $graphql_name, // WPGraphQL for ACF: ім'я типу блоку
        ] ) );
        acf_add_local_field_group( [
            'key'                => 'group_' . $block['name'],
            'title'              => $block['title'] . ' Fields',
            'show_in_graphql'    => true,   // ← ОБОВ'ЯЗКОВО для типів AcfXxxBlock у схемі
            'graphql_field_name' => $graphql_name, // ← дані group під attributes.{graphql_field_name}
            'fields'             => $fields,
            'location'           => [ [ [ 'param' => 'block', 'operator' => '==', 'value' => 'acf/' . $block['name'] ] ] ],
        ] );
    }

    // ======================================================
    // Phase 8 — Поля Navbar Options
    // ======================================================
    acf_add_local_field_group( [
        'key'                => 'group_navbar_options',
        'title'              => 'Navbar Settings',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'navbar',
        'fields' => [
            [
                'key'           => 'field_nav_logo',
                'label'         => 'Logo (desktop)',
                'name'          => 'nav_logo',
                'type'          => 'image',
                'return_format' => 'array',
                'instructions'  => 'Full logo shown on desktop (e.g. logo2.svg). Leave empty to use default.',
            ],
            [
                'key'           => 'field_nav_logo_icon',
                'label'         => 'Logo Icon (mobile)',
                'name'          => 'nav_logo_icon',
                'type'          => 'image',
                'return_format' => 'array',
                'instructions'  => 'Icon-only logo for mobile (e.g. logo-icon.png).',
            ],
            [
                'key'        => 'field_nav_links',
                'label'      => 'Navigation Links',
                'name'       => 'nav_links',
                'type'       => 'repeater',
                'min'        => 1,
                'layout'     => 'table',
                'sub_fields' => [
                    [ 'key' => 'field_nav_link_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text', 'column_width' => '40' ],
                    [ 'key' => 'field_nav_link_url',   'label' => 'URL',   'name' => 'url',   'type' => 'text', 'column_width' => '60', 'instructions' => 'e.g. /memberships or https://...' ],
                ],
            ],
            [
                'key'   => 'field_nav_cta_text',
                'label' => 'CTA Button Text',
                'name'  => 'nav_cta_text',
                'type'  => 'text',
            ],
            [
                'key'          => 'field_nav_cta_url',
                'label'        => 'CTA Button URL',
                'name'         => 'nav_cta_url',
                'type'         => 'text',
                'instructions' => 'e.g. /memberships or https://...',
            ],
        ],
        'location' => [ [ [ 'param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-navbar' ] ] ],
    ] );

    // ======================================================
    // Phase 8 — Поля Footer Options
    // ======================================================
    acf_add_local_field_group( [
        'key'                => 'group_footer_options',
        'title'              => 'Footer Settings',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'footer',
        'fields' => [
            [
                'key'           => 'field_footer_logo',
                'label'         => 'Footer Logo',
                'name'          => 'footer_logo',
                'type'          => 'image',
                'return_format' => 'array',
            ],
            [
                'key'   => 'field_footer_email',
                'label' => 'Contact Email',
                'name'  => 'footer_email',
                'type'  => 'email',
            ],
            [
                'key'   => 'field_footer_phone',
                'label' => 'Contact Phone',
                'name'  => 'footer_phone',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_footer_cta_text',
                'label' => 'CTA Button Text',
                'name'  => 'footer_cta_text',
                'type'  => 'text',
            ],
            [
                'key'          => 'field_footer_cta_url',
                'label'        => 'CTA Button URL',
                'name'         => 'footer_cta_url',
                'type'         => 'text',
                'instructions' => 'e.g. /memberships or https://...',
            ],
            [
                'key'        => 'field_footer_menu_links',
                'label'      => 'Menu Links',
                'name'       => 'footer_menu_links',
                'type'       => 'repeater',
                'layout'     => 'table',
                'sub_fields' => [
                    [ 'key' => 'field_footer_menu_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text' ],
                    [ 'key' => 'field_footer_menu_url',   'label' => 'URL',   'name' => 'url',   'type' => 'text', 'instructions' => 'e.g. /about' ],
                ],
            ],
            [
                'key'        => 'field_footer_locations',
                'label'      => 'Locations',
                'name'       => 'footer_locations',
                'type'       => 'repeater',
                'layout'     => 'block',
                'sub_fields' => [
                    [ 'key' => 'field_footer_loc_name',    'label' => 'Location Name',    'name' => 'name',    'type' => 'text'     ],
                    [ 'key' => 'field_footer_loc_address', 'label' => 'Location Address', 'name' => 'address', 'type' => 'textarea' ],
                ],
            ],
            [
                'key'   => 'field_footer_copyright',
                'label' => 'Copyright Text',
                'name'  => 'footer_copyright',
                'type'  => 'text',
            ],
            [
                'key'        => 'field_footer_legal_links',
                'label'      => 'Legal Links (Privacy Policy, Terms, etc.)',
                'name'       => 'footer_legal_links',
                'type'       => 'repeater',
                'layout'     => 'table',
                'sub_fields' => [
                    [ 'key' => 'field_footer_legal_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text' ],
                    [ 'key' => 'field_footer_legal_url',   'label' => 'URL',   'name' => 'url',   'type' => 'text', 'instructions' => 'e.g. /privacy-policy' ],
                ],
            ],
        ],
        'location' => [ [ [ 'param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-footer' ] ] ],
    ] );

    // ======================================================
    // Phase 8 — Поля Book Modal Options
    // ======================================================
    acf_add_local_field_group( [
        'key'                => 'group_book_modal_options',
        'title'              => 'Book Modal Settings',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'bookModal', // → acfOptionsBookModal { bookModal { ... } }
        'fields' => [
            [ 'key' => 'field_bm_modal_title',     'label' => 'Modal Title',          'name' => 'modal_title',          'type' => 'text'  ],
            [ 'key' => 'field_bm_modal_subtitle',  'label' => 'Modal Subtitle',       'name' => 'modal_subtitle',       'type' => 'text'  ],
            [ 'key' => 'field_bm_sport1_title',    'label' => 'Sport 1 Title',        'name' => 'sport1_title',         'type' => 'text'  ],
            [ 'key' => 'field_bm_sport1_image',    'label' => 'Sport 1 Image',        'name' => 'sport1_image',         'type' => 'image', 'return_format' => 'array', 'instructions' => 'Return format must be Array for WPGraphQL sourceUrl' ],
            [ 'key' => 'field_bm_sport1_btn_text', 'label' => 'Sport 1 Button Text', 'name' => 'sport1_button_text',   'type' => 'text'  ],
            [ 'key' => 'field_bm_sport1_url',      'label' => 'Sport 1 Booking URL', 'name' => 'sport1_booking_url',   'type' => 'url',   'instructions' => 'External booking URL for Padel' ],
            [ 'key' => 'field_bm_sport2_title',    'label' => 'Sport 2 Title',        'name' => 'sport2_title',         'type' => 'text'  ],
            [ 'key' => 'field_bm_sport2_image',    'label' => 'Sport 2 Image',        'name' => 'sport2_image',         'type' => 'image', 'return_format' => 'array', 'instructions' => 'Return format must be Array for WPGraphQL sourceUrl' ],
            [ 'key' => 'field_bm_sport2_btn_text', 'label' => 'Sport 2 Button Text', 'name' => 'sport2_button_text',   'type' => 'text'  ],
            [ 'key' => 'field_bm_sport2_url',      'label' => 'Sport 2 Booking URL', 'name' => 'sport2_booking_url',   'type' => 'url',   'instructions' => 'External booking URL for Pickleball' ],
        ],
        'location' => [ [ [ 'param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-book-modal' ] ] ],
    ] );

    // ======================================================
    // Групи полів CPT (Вакансії, Відгуки, Локації, Програми, Плани членства)
    // ======================================================

    // CPT Вакансії (Jobs)
    acf_add_local_field_group( [
        'key'                => 'group_cpt_job',
        'title'              => 'Job Details',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'jobFields', // → jobs { nodes { jobFields { description category } } }
        'fields' => [
            [ 'key' => 'field_job_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea' ],
            [ 'key' => 'field_job_category',    'label' => 'Category',    'name' => 'category',    'type' => 'text' ],
        ],
        'location' => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'job' ] ] ],
    ] );

    // CPT Відгуки (Testimonials)
    // Примітка: field_test_label / field_test_title / field_test_description зайняті блоком testimonials —
    // CPT-специфічні ключі (category, rating, quote, author_*) НЕ конфліктують.
    acf_add_local_field_group( [
        'key'                => 'group_cpt_testimonial',
        'title'              => 'Testimonial Details',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'testimonialFields', // → testimonials { nodes { testimonialFields { authorName } } }
        'fields' => [
            [ 'key' => 'field_test_category',        'label' => 'Category',        'name' => 'category',        'type' => 'text' ],
            [ 'key' => 'field_test_rating',          'label' => 'Rating',          'name' => 'rating',          'type' => 'number' ],
            [ 'key' => 'field_test_max_rating',      'label' => 'Max Rating',      'name' => 'max_rating',      'type' => 'number' ],
            [ 'key' => 'field_test_quote',           'label' => 'Quote',           'name' => 'quote',           'type' => 'textarea' ],
            [ 'key' => 'field_test_author_name',     'label' => 'Author Name',     'name' => 'author_name',     'type' => 'text' ],
            [ 'key' => 'field_test_author_subtitle', 'label' => 'Author Subtitle', 'name' => 'author_subtitle', 'type' => 'text' ],
        ],
        'location' => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'testimonial' ] ] ],
    ] );

    // CPT Локації (Locations)
    // Примітка: field_loc_description конфліктує з полем блоку racqueteer-locations —
    // CPT description використовує унікальний ключ field_cpt_loc_description (ACF name = 'description').
    acf_add_local_field_group( [
        'key'                => 'group_cpt_location',
        'title'              => 'Location Details',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'locationFields', // → locations { nodes { locationFields { name status } } }
        'fields' => [
            [ 'key' => 'field_loc_location_id',     'label' => 'Location ID',  'name' => 'location_id',  'type' => 'text' ],
            [ 'key' => 'field_loc_name',            'label' => 'Name',         'name' => 'name',         'type' => 'text' ],
            [
                'key'             => 'field_loc_status',
                'label'           => 'Status',
                'name'            => 'status',
                'type'            => 'select',
                'choices'         => [ 'available' => 'Available', 'coming_soon' => 'Coming Soon' ],
                'default_value'   => 'available',
                'allow_null'      => 0,
                'multiple'        => 0,
                'return_format'   => 'value',
                // Excluded from WPGraphQL for ACF auto-generation — WPGraphQL for ACF v2.6.x
                // stores select values serialized (PHP array), causing TypeError in PHP 8.x.
                // Exposed manually via register_graphql_field('Location','locationStatus',…)
                // in graphql-extensions.php → uses get_field() which formats properly.
                'show_in_graphql' => false,
            ],
            [
                'key'          => 'field_loc_address',
                'label'        => 'Address (one line per row)',
                'name'         => 'address',
                'type'         => 'textarea',
                'rows'         => 2,
                'instructions' => 'Enter each address line on a new line. The frontend splits on newline.',
            ],
            [ 'key' => 'field_cpt_loc_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea' ],
            [ 'key' => 'field_loc_image',           'label' => 'Image',       'name' => 'image',       'type' => 'image', 'return_format' => 'array' ],
            [
                'key'             => 'field_loc_amenities',
                'label'           => 'Club Amenities',
                'name'            => 'amenities',
                'type'            => 'repeater',
                'layout'          => 'block',
                'min'             => 0,
                'max'             => 20,
                'button_label'    => 'Add Amenity',
                // show_in_graphql intentionally omitted — field is exposed manually
                // via register_graphql_field('Location', 'locationAmenities', …)
                // in graphql-extensions.php to avoid WPGraphQL for ACF v2.6.x
                // generating a broken type for the select sub-field.
                'sub_fields'      => [
                    [
                        'key'             => 'field_loc_amenity_icon',
                        'label'           => 'Icon',
                        'name'            => 'icon',
                        'type'            => 'select',
                        'choices'         => [
                            'courts'    => '🎾 Courts',
                            'lounge'    => '🛋 Lounge Zones',
                            'coworking' => '💻 Coworking',
                            'proshop'   => '🛍 Pro-Shop',
                            'cafe'      => '☕ Cafe',
                            'fitness'   => '💪 Fitness Areas',
                            'parking'   => '🅿 Parking',
                            'showers'   => '🚿 Showers',
                            'pool'      => '🏊 Pool',
                            'spa'       => '🧖 Spa',
                        ],
                        'return_format'   => 'value',
                        'allow_null'      => 0,
                        'multiple'        => 0,
                        'column_width'    => '30',
                        'instructions'    => 'Виберіть іконку для цієї amenity',
                    ],
                    [
                        'key'          => 'field_loc_amenity_label',
                        'label'        => 'Label',
                        'name'         => 'label',
                        'type'         => 'text',
                        'column_width' => '70',
                        'instructions' => 'Текст для відображення поряд з іконкою',
                    ],
                ],
            ],
        ],
        'location' => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'location' ] ] ],
    ] );

    // CPT Amenities
    acf_add_local_field_group( [
        'key'                => 'group_cpt_amenity',
        'title'              => 'Amenity Details',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'amenityFields', // → amenities { nodes { amenityFields { number imageLayout … } } }
        'fields' => [
            [
                'key'          => 'field_amenity_number',
                'label'        => 'Number',
                'name'         => 'number',
                'type'         => 'text',
                'instructions' => 'Display number, e.g. 01, 02…',
            ],
            [
                'key'          => 'field_amenity_image_layout',
                'label'        => 'Image Layout',
                'name'         => 'image_layout',
                'type'         => 'select',
                'choices'      => [ 'single' => 'Single', 'split' => 'Split' ],
                'default_value'=> 'single',
                'return_format'=> 'value',
                // Exposed manually as imageLayout via graphql-extensions.php to avoid
                // WPGraphQL for ACF v2.6.x serialized-array TypeError on select fields.
                'show_in_graphql' => false,
            ],
            [
                'key'             => 'field_amenity_images',
                'label'           => 'Images',
                'name'            => 'images',
                'type'            => 'gallery',
                'return_format'   => 'array',
                'instructions'    => 'Upload 1 image for single layout, 2 for split.',
                // Exposed manually via register_graphql_field('AmenityFields','images',…)
                // in graphql-extensions.php to return a simple [AmenityImage] list.
                // This avoids WPGraphQL for ACF generating AcfMediaItemConnection
                // which has no direct sourceUrl field.
                'show_in_graphql' => false,
            ],
            [
                'key'          => 'field_amenity_feat1_icon',
                'label'        => 'Feature 1 Icon Key',
                'name'         => 'feature_1_icon',
                'type'         => 'text',
                'instructions' => 'Icon key: courts, jumprope, locker, sauna, lounge, member, coffee, drink, laptop, video, shop',
            ],
            [
                'key'   => 'field_amenity_feat1_text',
                'label' => 'Feature 1 Text',
                'name'  => 'feature_1_text',
                'type'  => 'text',
            ],
            [
                'key'          => 'field_amenity_feat2_icon',
                'label'        => 'Feature 2 Icon Key',
                'name'         => 'feature_2_icon',
                'type'         => 'text',
                'instructions' => 'Icon key: courts, jumprope, locker, sauna, lounge, member, coffee, drink, laptop, video, shop',
            ],
            [
                'key'   => 'field_amenity_feat2_text',
                'label' => 'Feature 2 Text',
                'name'  => 'feature_2_text',
                'type'  => 'text',
            ],
        ],
        'location' => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'amenity' ] ] ],
    ] );

    // CPT Програми (Programs)
    // Використовує 'programFields' (НЕ 'acf'), щоб уникнути конфлікту типів з полем 'acf' для Membership.    // Загальний тип 'Acf', будований для membershipів, не включав би 'title' → помилки схеми.
    acf_add_local_field_group( [
        'key'                => 'group_cpt_program',
        'title'              => 'Program Details',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'programFields', // → programs { nodes { programFields { title color price } } }
        'fields' => [
            [ 'key' => 'field_cpt_prog_title',       'label' => 'Title',       'name' => 'title',       'type' => 'text'     ],
            [
                'key'     => 'field_prog_color',
                'label'   => 'Color',
                'name'    => 'color',
                'type'    => 'select',
                'choices' => [ 'red' => 'Red', 'blue' => 'Blue' ],
            ],
            [ 'key' => 'field_prog_price',           'label' => 'Price',       'name' => 'price',       'type' => 'text'     ],
            [ 'key' => 'field_prog_unit',            'label' => 'Unit',        'name' => 'unit',        'type' => 'text'     ],
            [ 'key' => 'field_cpt_prog_description', 'label' => 'Description', 'name' => 'description', 'type' => 'textarea' ],
        ],
        'location' => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'program' ] ] ],
    ] );

    // CPT Плани членства (Membership Plans)
    acf_add_local_field_group( [
        'key'                => 'group_cpt_membership',
        'title'              => 'Membership Plan Details',
        'show_in_graphql'    => true,
        'graphql_field_name' => 'acf', // ← свідомо 'acf'; підтверджено роботу у схемі
        'fields' => [
            [ 'key' => 'field_mem_description',  'label' => 'Description',  'name' => 'description',   'type' => 'text'      ],
            [ 'key' => 'field_mem_price',         'label' => 'Price',        'name' => 'price',         'type' => 'text'      ],
            [
                'key'     => 'field_mem_button_variant',
                'label'   => 'Button Variant',
                'name'    => 'button_variant',
                'type'    => 'select',
                'choices' => [ 'blue' => 'Blue', 'red' => 'Red' ],
            ],
            [ 'key' => 'field_mem_bg_class',     'label' => 'BG Class',     'name' => 'bg_class',      'type' => 'text'       ],
            [ 'key' => 'field_mem_border_class', 'label' => 'Border Class', 'name' => 'border_class',  'type' => 'text'       ],
            [ 'key' => 'field_mem_has_image',    'label' => 'Has Image',    'name' => 'has_image',     'type' => 'true_false' ],
            [ 'key' => 'field_mem_values',       'label' => 'Values (comma-separated)', 'name' => 'values', 'type' => 'text'  ],
            [
                'key'          => 'field_mem_cta_text',
                'label'        => 'CTA Button Text',
                'name'         => 'cta_text',
                'type'         => 'text',
                'instructions' => 'e.g. Join Now',
                'default_value'=> 'JOIN NOW',
            ],
            [
                'key'          => 'field_mem_cta_url',
                'label'        => 'CTA Button URL',
                'name'         => 'cta_url',
                'type'         => 'text',
                'instructions' => 'Link for this plan\'s JOIN NOW button. e.g. /memberships or https://checkout.example.com/starter',
            ],
        ],
        'location' => [ [ [ 'param' => 'post_type', 'operator' => '==', 'value' => 'membership' ] ] ],
    ] );

} );
