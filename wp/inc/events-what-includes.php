<?php
/**
 * Events Section — What Includes repeater field registration.
 *
 * Registered in a separate file to avoid PHP OPcache issues.
 * Included from functions.php after acf-blocks.php.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

add_action( 'acf/init', function () {

    if ( ! function_exists( 'acf_add_local_field_group' ) ) {
        return;
    }

    acf_add_local_field_group( array(
        'key'      => 'group_events_what_includes_2026',
        'title'    => 'Events Section — What Includes',
        'fields'   => array(
            array(
                'key'          => 'field_events_what_includes_2026',
                'label'        => 'What Includes',
                'name'         => 'what_includes',
                'type'         => 'repeater',
                'instructions' => 'Add items for the "What Includes" panel on the right.',
                'required'     => 0,
                'min'          => 0,
                'max'          => 20,
                'layout'       => 'block',
                'button_label' => 'Add Item',
                'sub_fields'   => array(
                    array(
                        'key'          => 'field_events_wi_text_2026',
                        'label'        => 'Text',
                        'name'         => 'text',
                        'type'         => 'text',
                        'instructions' => 'e.g. Private event packages for any occasion',
                        'required'     => 1,
                    ),
                    array(
                        'key'           => 'field_events_wi_icon_2026',
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
                    ),
                ),
            ),
        ),
        'location' => array(
            array(
                array(
                    'param'    => 'block',
                    'operator' => '==',
                    'value'    => 'acf/racqueteer-events',
                ),
            ),
        ),
        'menu_order'            => 99,
        'active'                => true,
    ) );

}, 20 );

