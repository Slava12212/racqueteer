<?php
/**
 * ACF Blocks Registration
 * Реєстрація всіх Gutenberg блоків через ACF PRO (headless — render_callback повертає порожній рядок).
 */
if ( ! function_exists( 'acf_register_block_type' ) ) {
    return;
}

/**
 * Headless render callback — outputs a minimal editor placeholder so ACF
 * can correctly initialise and persist field values. Returns empty string
 * on the front-end (used only as a CMS/API backend).
 */
function racqueteer_block_render_callback( array $block ): void {
    // На фронтенді (headless) нічого не виводимо.
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
                Поля порожні
            </p>
        <?php endif; ?>

    </div>
    <?php
}

add_action( 'acf/init', function () {
    $blocks = [
        // Home
        ['name'=>'racqueteer-hero','title'=>'Hero Section','icon'=>'cover-image','keywords'=>['hero','banner'],'fields'=>[
            ['key'=>'field_hero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_hero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_hero_cta_primary_text','label'=>'CTA Primary Text','name'=>'cta_primary_text','type'=>'text'],
            ['key'=>'field_hero_cta_primary_url','label'=>'CTA Primary URL','name'=>'cta_primary_url','type'=>'url'],
            ['key'=>'field_hero_cta_secondary_text','label'=>'CTA Secondary Text','name'=>'cta_secondary_text','type'=>'text'],
            ['key'=>'field_hero_cta_secondary_url','label'=>'CTA Secondary URL','name'=>'cta_secondary_url','type'=>'url'],
            ['key'=>'field_hero_video','label'=>'Video URL','name'=>'video_url','type'=>'url'],
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
            ['key'=>'field_mship_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'url'],
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
            ['key'=>'field_events_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'url'],
            ['key'=>'field_events_image','label'=>'Image','name'=>'image','type'=>'image','return_format'=>'url'],
        ]],
        // Memberships Page
        ['name'=>'racqueteer-membership-hero','title'=>'Membership Hero','icon'=>'cover-image','keywords'=>['membership','hero'],'fields'=>[
            ['key'=>'field_mhero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_mhero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_mhero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_mhero_price_starting','label'=>'Price Starting','name'=>'price_starting','type'=>'text'],
            ['key'=>'field_mhero_price_unit','label'=>'Price Unit','name'=>'price_unit','type'=>'text'],
            ['key'=>'field_mhero_cta_text','label'=>'CTA Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_mhero_video','label'=>'Video URL','name'=>'video_url','type'=>'url'],
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
        ]],
        // Private Events Page
        ['name'=>'racqueteer-private-events-hero','title'=>'Private Events Hero','icon'=>'cover-image','keywords'=>['private events'],'fields'=>[
            ['key'=>'field_pehero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_pehero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_pehero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_pehero_cta_text','label'=>'CTA Text','name'=>'cta_text','type'=>'text'],
            ['key'=>'field_pehero_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'url'],
            ['key'=>'field_pehero_video','label'=>'Video URL','name'=>'video_url','type'=>'url'],
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
        // About Page
        ['name'=>'racqueteer-about-hero','title'=>'About Hero','icon'=>'cover-image','keywords'=>['about','hero'],'fields'=>[
            ['key'=>'field_ahero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_ahero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_ahero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_ahero_video','label'=>'Video URL','name'=>'video_url','type'=>'url'],
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
            ['key'=>'field_cont_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'url'],
        ]],
        // Careers Page
        ['name'=>'racqueteer-careers-hero','title'=>'Careers Hero','icon'=>'cover-image','keywords'=>['careers'],'fields'=>[
            ['key'=>'field_chero_label','label'=>'Label','name'=>'label','type'=>'text'],
            ['key'=>'field_chero_title','label'=>'Title','name'=>'title','type'=>'text'],
            ['key'=>'field_chero_description','label'=>'Description','name'=>'description','type'=>'textarea'],
            ['key'=>'field_chero_video','label'=>'Video URL','name'=>'video_url','type'=>'url'],
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
            ['key'=>'field_cc_cta_url','label'=>'CTA URL','name'=>'cta_url','type'=>'url'],
            ['key'=>'field_cc_image','label'=>'Image','name'=>'image','type'=>'image','return_format'=>'url'],
        ]],
    ];
    foreach ( $blocks as $block ) {
        $fields = $block['fields'];
        unset( $block['fields'] );
        acf_register_block_type( array_merge( $block, [
            'api_version'     => 3,
            'category'        => 'racqueteer',
            'mode'            => 'edit',   // завжди показувати поля в центрі
            'render_callback' => 'racqueteer_block_render_callback',
        ] ) );
        acf_add_local_field_group( [
            'key'      => 'group_' . $block['name'],
            'title'    => $block['title'] . ' Fields',
            'fields'   => $fields,
            'location' => [ [ [ 'param' => 'block', 'operator' => '==', 'value' => 'acf/' . $block['name'] ] ] ],
        ] );
    }

    // ======================================================
    // Phase 8 — Navbar Options Fields
    // ======================================================
    acf_add_local_field_group( [
        'key'    => 'group_navbar_options',
        'title'  => 'Navbar Settings',
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
                    [ 'key' => 'field_nav_link_url',   'label' => 'URL',   'name' => 'url',   'type' => 'url',  'column_width' => '60' ],
                ],
            ],
            [
                'key'   => 'field_nav_cta_text',
                'label' => 'CTA Button Text',
                'name'  => 'nav_cta_text',
                'type'  => 'text',
            ],
            [
                'key'   => 'field_nav_cta_url',
                'label' => 'CTA Button URL',
                'name'  => 'nav_cta_url',
                'type'  => 'url',
            ],
        ],
        'location' => [ [ [ 'param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-navbar' ] ] ],
    ] );

    // ======================================================
    // Phase 8 — Footer Options Fields
    // ======================================================
    acf_add_local_field_group( [
        'key'    => 'group_footer_options',
        'title'  => 'Footer Settings',
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
                'key'   => 'field_footer_cta_url',
                'label' => 'CTA Button URL',
                'name'  => 'footer_cta_url',
                'type'  => 'url',
            ],
            [
                'key'        => 'field_footer_menu_links',
                'label'      => 'Menu Links',
                'name'       => 'footer_menu_links',
                'type'       => 'repeater',
                'layout'     => 'table',
                'sub_fields' => [
                    [ 'key' => 'field_footer_menu_label', 'label' => 'Label', 'name' => 'label', 'type' => 'text' ],
                    [ 'key' => 'field_footer_menu_url',   'label' => 'URL',   'name' => 'url',   'type' => 'url'  ],
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
                    [ 'key' => 'field_footer_legal_url',   'label' => 'URL',   'name' => 'url',   'type' => 'url'  ],
                ],
            ],
        ],
        'location' => [ [ [ 'param' => 'options_page', 'operator' => '==', 'value' => 'acf-options-footer' ] ] ],
    ] );
} );
