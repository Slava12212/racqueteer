<?php
/**
 * Реєстрація Custom Post Types
 *
 * CPT для динамічних даних (не блоків макету).
 * Ці типи доступні через WPGraphQL як окремі колекції.
 */

add_action( 'init', function () {

    // ── Вакансії (Careers) ───────────────────────────────────────────────────────
    register_post_type( 'job', [
        'labels'       => [
            'name'          => 'Вакансії',
            'singular_name' => 'Вакансія',
            'add_new_item'  => 'Додати нову вакансію',
            'edit_item'     => 'Редагувати вакансію',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'job',
        'graphql_plural_name' => 'jobs',
        'supports'      => [ 'title', 'custom-fields', 'page-attributes' ], // page-attributes = поле сортування
        'menu_icon'     => 'dashicons-businessman',
    ] );

    // ── Відгуки ─────────────────────────────────────────────────────────────
    register_post_type( 'testimonial', [
        'labels'       => [
            'name'          => 'Відгуки',
            'singular_name' => 'Відгук',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'testimonial',
        'graphql_plural_name' => 'testimonials',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-format-quote',
    ] );

    // ── Плани членства ─────────────────────────────────────────────────────────
    register_post_type( 'membership', [
        'labels'       => [
            'name'          => 'Плани членства',
            'singular_name' => 'План членства',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'membership',
        'graphql_plural_name' => 'memberships',
        'supports'      => [ 'title', 'custom-fields', 'page-attributes' ], // page-attributes = поле сортування
        'menu_icon'     => 'dashicons-awards',
    ] );

    // ── Зручності ────────────────────────────────────────────────────────────
    register_post_type( 'amenity', [
        'labels'       => [
            'name'          => 'Зручності',
            'singular_name' => 'Зручність',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'amenity',
        'graphql_plural_name' => 'amenities',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-star-filled',
    ] );

    // ── Локації ────────────────────────────────────────────────────────────
    register_post_type( 'location', [
        'labels'       => [
            'name'          => 'Локації',
            'singular_name' => 'Локація',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'location',
        'graphql_plural_name' => 'locations',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-location-alt',
    ] );

    // ── Програми / Клініки ───────────────────────────────────────────────────
    register_post_type( 'program', [
        'labels'       => [
            'name'          => 'Програми',
            'singular_name' => 'Програма',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'program',
        'graphql_plural_name' => 'programs',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-clipboard',
    ] );

} );
