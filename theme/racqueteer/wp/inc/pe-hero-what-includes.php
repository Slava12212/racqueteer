<?php
/**
 * Private Events Hero — What Includes repeater field registration.
 *
 * Registered in a separate file to avoid PHP OPcache issues and
 * to keep it fully isolated from the main acf-blocks.php loop.
 *
 * Included from functions.php after acf-blocks.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'acf/init', function () {

    if ( ! function_exists( 'acf_add_local_field_group' ) ) {
        return;
    }

    // Field group: adds "What Includes" repeater to the Private Events Hero block.
    // Using a completely unique key so ACF never confuses it with a cached version.
    acf_add_local_field_group( array(
        'key'      => 'group_pe_hero_what_includes_2026',
        'title'    => 'Private Events Hero — What Includes',
        'fields'   => array(
            array(
                'key'          => 'field_pe_what_includes_2026',
                'label'        => 'What Includes',
                'name'         => 'what_includes',
                'type'         => 'repeater',
                'instructions' => 'Add items that will appear in the "What Includes" panel.',
                'required'     => 0,
                'min'          => 0,
                'max'          => 20,
                'layout'       => 'block',
                'button_label' => 'Add Item',
                'sub_fields'   => array(
                    array(
                        'key'          => 'field_pe_wi_item_text_2026',
                        'label'        => 'Text',
                        'name'         => 'text',
                        'type'         => 'text',
                        'instructions' => 'e.g. Private event packages for any occasion',
                        'required'     => 1,
                        'column_width' => '',
                    ),
                    array(
                        'key'           => 'field_pe_wi_item_icon_2026',
                        'label'         => 'Icon',
                        'name'          => 'icon',
                        'type'          => 'select',
                        'instructions'  => 'Choose the icon displayed next to the text.',
                        'required'      => 0,
                        'choices'       => array(
                            'box' => 'Box (Package)',
                            'vip' => 'VIP (Crown)',
                        ),
                        'default_value' => 'box',
                        'return_format' => 'value',
                        'allow_null'    => 0,
                        'multiple'      => 0,
                        'ui'            => 1,
                        'ajax'          => 0,
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param'    => 'block',
                    'operator' => '==',
                    'value'    => 'acf/racqueteer-private-events-hero',
                ),
            ),
        ),
        'menu_order'            => 99,
        'position'              => 'normal',
        'style'                 => 'default',
        'label_placement'       => 'top',
        'instruction_placement' => 'label',
        'active'                => true,
    ) );

}, 20 ); // Priority 20 — after acf/init priority 10 (block registration)

