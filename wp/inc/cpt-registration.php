<?php
/**
 * Custom Post Types Registration
 *
 * CPT для динамічних даних (не layout-блоки).
 * Ці типи будуть доступні через WPGraphQL як окремі колекції.
 */

add_action( 'init', function () {

    // ── Jobs (Careers) ───────────────────────────────────────────────────────
    register_post_type( 'job', [
        'labels'       => [
            'name'          => 'Jobs',
            'singular_name' => 'Job',
            'add_new_item'  => 'Add New Job',
            'edit_item'     => 'Edit Job',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'job',
        'graphql_plural_name' => 'jobs',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-businessman',
    ] );

    // ── Testimonials ─────────────────────────────────────────────────────────
    register_post_type( 'testimonial', [
        'labels'       => [
            'name'          => 'Testimonials',
            'singular_name' => 'Testimonial',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'testimonial',
        'graphql_plural_name' => 'testimonials',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-format-quote',
    ] );

    // ── Membership Plans ─────────────────────────────────────────────────────
    register_post_type( 'membership', [
        'labels'       => [
            'name'          => 'Membership Plans',
            'singular_name' => 'Membership Plan',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'membership',
        'graphql_plural_name' => 'memberships',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-awards',
    ] );

    // ── Amenities ────────────────────────────────────────────────────────────
    register_post_type( 'amenity', [
        'labels'       => [
            'name'          => 'Amenities',
            'singular_name' => 'Amenity',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'amenity',
        'graphql_plural_name' => 'amenities',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-star-filled',
    ] );

    // ── Locations ────────────────────────────────────────────────────────────
    register_post_type( 'location', [
        'labels'       => [
            'name'          => 'Locations',
            'singular_name' => 'Location',
        ],
        'public'        => true,
        'show_in_rest'  => true,
        'show_in_graphql' => true,
        'graphql_single_name' => 'location',
        'graphql_plural_name' => 'locations',
        'supports'      => [ 'title', 'custom-fields' ],
        'menu_icon'     => 'dashicons-location-alt',
    ] );

    // ── Programs / Clinics ───────────────────────────────────────────────────
    register_post_type( 'program', [
        'labels'       => [
            'name'          => 'Programs',
            'singular_name' => 'Program',
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

